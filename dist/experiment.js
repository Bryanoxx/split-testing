"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameLocalAndGivenSeed = exports.setPickedVariant = exports.getPickedVariant = exports.getPickedVariantName = exports.setExperiment = void 0;
const utils_1 = require("./utils");
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
function setExperiment({ name, variants, seed, debug, onVariantPicked }) {
    // Configuration of the debug mode
    if (debug === true) {
        (0, utils_1.defineDebugMode)(true);
        (0, utils_1.log)('Running split testing with these options :');
        (0, utils_1.log)({ experimentName: name, variants, seed });
    }
    const localVariantName = getPickedVariantName(name);
    if (localVariantName === null) {
        // First-time user: picking his variant
        (0, utils_1.log)('Local variant does not exist, picking it...');
        setPickedVariant({
            experimentName: name,
            variants,
            seed,
            callback: onVariantPicked
        });
    }
    else {
        // The user already came: if provided, checking the seeds for having a consistent variant
        (0, utils_1.log)(`Local variant detected: ${localVariantName}`);
        if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName: name, seed })) {
            (0, utils_1.log)('Conflict between the local seed and the given seed, updating local variant');
            setPickedVariant({
                experimentName: name,
                variants,
                seed,
                callback: onVariantPicked
            });
        }
    }
}
exports.setExperiment = setExperiment;
/**
 * Get the local variant of the experiment.
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(Variant | null)}
 */
function getPickedVariantName(experimentName) {
    const pickedVariantName = localStorage.getItem(`${experimentName}-variant-name`);
    return pickedVariantName;
}
exports.getPickedVariantName = getPickedVariantName;
/**
 * Get all the details of a variant with its name
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
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
function setPickedVariant({ experimentName, variants, seed, callback }) {
    // Random picking of the variant (or constant if seed provided) and saving it in localStorage
    // TODO: take into account the weight of the variants
    const randomIndex = (0, utils_1.getRandomIndex)(variants, seed);
    const pickedVariant = variants[randomIndex];
    localStorage.setItem(`${experimentName}-variant-name`, pickedVariant.name);
    (0, utils_1.log)(`New local variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`);
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
exports.setPickedVariant = setPickedVariant;
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
