"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVariantsWithEqualWeights = exports.sameLocalAndGivenSeed = exports.pickVariant = exports.getPickedVariant = exports.getPickedVariantName = exports.setExperiment = void 0;
const utils_1 = require("./utils");
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 * @return {*}  {boolean}
 */
function setExperiment(options) {
    // Extraction and validation of the options
    const { name: experimentName, seed, debug, onVariantPicked, resolveSeedConflict } = options;
    const variants = (0, utils_1.clone)(options.variants);
    if (typeof experimentName !== 'string' || experimentName.length === 0) {
        (0, utils_1.error)('Experiment name is required');
        return false;
    }
    if (!Array.isArray(variants) || variants.length === 0) {
        (0, utils_1.error)('Variants are required');
        return false;
    }
    const variantsHaveNames = variants.every(variant => variant.name !== undefined && variant.name.length > 0);
    if (!variantsHaveNames) {
        (0, utils_1.error)('All variants must have a name');
        return false;
    }
    // Configuration of the debug mode
    if (debug === true) {
        (0, utils_1.defineDebugMode)(true);
        (0, utils_1.log)('Running split testing with these options :');
        (0, utils_1.log)({ experimentName, variants: options.variants, seed, debug });
    }
    // Picking or verification of the variant
    const pickedVariantName = getPickedVariantName(experimentName);
    if (pickedVariantName === null) {
        (0, utils_1.log)('No variant picked in localStorage, picking it now');
        pickVariant({
            experimentName,
            variants,
            seed,
            callback: onVariantPicked
        });
    }
    else {
        (0, utils_1.log)(`Variant already picked, named ${pickedVariantName}`);
        // Checking if the variant name is valid
        if (getPickedVariant({ experimentName, variants }) === undefined) {
            (0, utils_1.error)('Variant name in localStorage don\'t exist in the variants given in options');
            return false;
        }
        // Checking the seed for having a consistent variant
        if (resolveSeedConflict !== false && seed !== undefined && !sameLocalAndGivenSeed({ experimentName, seed })) {
            (0, utils_1.warn)('Conflict between the old seed and the current seed, updating the variant for the current seed');
            pickVariant({
                experimentName,
                variants,
                seed,
                callback: onVariantPicked
            });
        }
    }
    return true;
}
exports.setExperiment = setExperiment;
/**
 * Get the picked variant's name
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(string | null)}
 */
function getPickedVariantName(experimentName) {
    const pickedVariantName = localStorage.getItem(`${experimentName}-variant-name`);
    return pickedVariantName;
}
exports.getPickedVariantName = getPickedVariantName;
/**
 * Get all the details of the picked variant
 *
 * @export
 * @param {{ variantName: string, variants: Variant[]}} { variantName, variants }
 * @return {*}  {(Variant | undefined)}
 */
function getPickedVariant({ experimentName, variants }) {
    // Name of the picked variant
    const pickedVariantName = getPickedVariantName(experimentName);
    if (pickedVariantName === null) {
        return undefined;
    }
    // Finding details of the picked variant
    const pickedVariant = variants.find(variant => variant.name === pickedVariantName);
    return pickedVariant;
}
exports.getPickedVariant = getPickedVariant;
/**
 * Pick and save the variant of the experiment in localStorage
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
function pickVariant({ experimentName, variants, seed, callback }) {
    // Extracting weight-related variables
    const hasWeight = variants.some(variant => variant.weight !== undefined);
    const everyHasWeight = variants.every(variant => variant.weight !== undefined);
    const totalWeight = variants.reduce((acc, variant) => { var _a; return acc + ((_a = variant.weight) !== null && _a !== void 0 ? _a : 0); }, 0);
    // Validating the weigh of the variants
    if (hasWeight && !everyHasWeight) {
        (0, utils_1.warn)('SplitTesting.js: Some variants have a weight but not all of them, reset of all weight');
        variants = makeVariantsWithEqualWeights(variants);
    }
    else if (everyHasWeight && totalWeight !== 1) {
        (0, utils_1.warn)('SplitTesting.js: The total of all weight is not equal to 1, reset of all weight');
        variants = makeVariantsWithEqualWeights(variants);
    }
    else if (!hasWeight) {
        // All the variant don't have a weight property
        variants = makeVariantsWithEqualWeights(variants);
    }
    // Random picking of the variant (or constant if seed provided) and saving it in localStorage
    const pickedVariant = (0, utils_1.getWeightedRandomElement)(variants, seed);
    localStorage.setItem(`${experimentName}-variant-name`, pickedVariant.name);
    (0, utils_1.log)(`New picked variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`);
    // Saving the seed if provided, for further verifications next time the user come
    if (seed !== undefined) {
        localStorage.setItem(`${experimentName}-seed`, seed);
    }
    else {
        localStorage.removeItem(`${experimentName}-seed`);
    }
    // Executing the callback if provided
    if (callback !== undefined) {
        callback(pickedVariant);
    }
}
exports.pickVariant = pickVariant;
/**
 * Check if the local seed and the given seed are consistent.
 *
 * @export
 * @param {({ experimentName: string, seed: string | undefined })} { experimentName, seed }
 * @return {*}  {boolean}
 */
function sameLocalAndGivenSeed({ experimentName, seed }) {
    const localSeed = localStorage.getItem(`${experimentName}-seed`);
    return localSeed === seed;
}
exports.sameLocalAndGivenSeed = sameLocalAndGivenSeed;
/**
 * Reset the weight property of each variant for equal probability of being picked
 *
 * @export
 * @param {Variant[]} variants
 * @return {*}  {Variant[]}
 */
function makeVariantsWithEqualWeights(variants) {
    (0, utils_1.log)('Making all weight equal so the variants have the same probability of being picked');
    const weightValue = 1 / variants.length;
    const newVariants = variants.map(variant => {
        variant.weight = weightValue;
        return variant;
    });
    return newVariants;
}
exports.makeVariantsWithEqualWeights = makeVariantsWithEqualWeights;
