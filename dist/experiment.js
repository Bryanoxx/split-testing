"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setExperiment = void 0;
const weight_1 = require("./utils/weight");
const utils_1 = require("./utils/utils");
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 * @return {*}  {boolean}
 */
function setExperiment(options) {
    var _a, _b, _c;
    // Validation of the options
    if (typeof options.name !== 'string' || options.name.length === 0) {
        throw (0, utils_1.createError)('The experiment name must be a non-empty string');
    }
    if (!Array.isArray(options.variants) || options.variants.length === 0) {
        throw (0, utils_1.createError)('The variants must be an array of at least one element');
    }
    const variantsHaveNames = options.variants.every(variant => variant.name !== undefined && variant.name.length > 0);
    if (!variantsHaveNames) {
        throw (0, utils_1.createError)('The variants must have a name');
    }
    options.storage = (_a = options.storage) !== null && _a !== void 0 ? _a : (globalThis.window !== undefined ? globalThis.window.localStorage : undefined);
    if (options.storage === undefined) {
        throw (0, utils_1.createError)('No storage available, please define a custom storage property');
    }
    // Extraction of the options
    const experiment = {
        name: options.name,
        variants: (0, utils_1.deepClone)(options.variants),
        seed: options.seed,
        isDebugMode: (_b = options.isDebugMode) !== null && _b !== void 0 ? _b : false,
        isResolvingSeedConflictAllowed: (_c = options.isResolvingSeedConflictAllowed) !== null && _c !== void 0 ? _c : true,
        storage: options.storage
    };
    // Configuration of the logget depending on the debug mode
    const logger = (0, utils_1.makeLogger)(experiment.isDebugMode);
    logger('Running split testing with these options :');
    logger(experiment);
    // Picking the variant or verifying it if it exists
    const pickedVariant = getPickedVariant(experiment);
    if (pickedVariant === null) {
        // Picking the variant for the first time
        logger('No variant picked in storage, picking it now');
        const newlyPickedVariant = pickAndSetVariant(experiment, logger);
        if (experiment.onFirstPicking !== undefined) {
            experiment.onFirstPicking(newlyPickedVariant);
        }
        return newlyPickedVariant;
    }
    else {
        // Verifying the variant coherencde if it already exists
        logger(`Variant already picked, named ${pickedVariant.name}`);
        // Checking if the variant name is valid
        if (getPickedVariant(experiment) === undefined) {
            throw (0, utils_1.createError)(`The variant named ${pickedVariant.name} is not valid (not found in the variants)`);
        }
        // Checking the seed for having a consistent variant
        if (experiment.isResolvingSeedConflictAllowed && experiment.seed !== undefined && !sameLocalAndGivenSeed(experiment)) {
            (0, utils_1.warningLogger)('Conflict between the old seed and the current seed, updating the variant for the current seed');
            const newlyPickedVariant = pickAndSetVariant(experiment, logger);
            return newlyPickedVariant;
        }
        return pickedVariant;
    }
}
exports.setExperiment = setExperiment;
/**
 * Get all the details of the picked variant from storage
 *
 * @param {SafeExperimentOptions} experiment
 * @return {*}  {(Variant | undefined)}
 */
function getPickedVariant(experiment) {
    // Name of the picked variant
    const pickedVariantName = experiment.storage.getItem(`ST-${experiment.name}-variant-name`);
    if (pickedVariantName === null) {
        return null;
    }
    // Finding details of the picked variant
    const pickedVariant = experiment.variants.find(variant => variant.name === pickedVariantName);
    return pickedVariant !== null && pickedVariant !== void 0 ? pickedVariant : null;
}
/**
 * Set the name and seed of the picked variant in storage
 *
 * @param {SafeExperimentOptions} { name: experimentName, storage, seed }
 * @param {Variant} pickedVariant
 * @param {ReturnType<typeof makeLogger>} log
 */
function setPickedVariant({ name: experimentName, storage, seed }, pickedVariant, log) {
    storage.setItem(`ST-${experimentName}-variant-name`, pickedVariant.name);
    log(`New picked variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`);
    // Saving the seed if provided, for further verifications next time the user come
    if (seed !== undefined) {
        storage.setItem(`ST-${experimentName}-seed`, seed);
    }
    else {
        storage.removeItem(`ST-${experimentName}-seed`);
    }
}
/**
 * Pick and save the variant of the experiment in storage
 *
 * @param {SafeExperimentOptions} { name: experimentName, variants, storage, seed, onFirstPicking }
 * @param {ReturnType<typeof makeLogger>} log
 */
function pickAndSetVariant(experiment, log) {
    // Extracting some properties
    const variants = experiment.variants;
    const seed = experiment.seed;
    // Validating the weight of the variants
    const areVariantsWellWeighted = (0, weight_1.validateWeightProperties)(variants);
    const weightedVariants = areVariantsWellWeighted ? variants : (0, weight_1.makeWeightPropertiesEqual)(variants);
    if (!areVariantsWellWeighted) {
        log('Making all weight equal so the variants have the same probability of being picked');
    }
    // Random picking of the variant (or constant if seed provided) and saving it in storage
    const pickedVariant = (0, weight_1.getWeightedRandomElement)(weightedVariants, seed);
    setPickedVariant(experiment, pickedVariant, log);
    return pickedVariant;
}
/**
 * Check if the local seed and the given seed are consistent.
 *
 * @param {SafeExperimentOptions} { name: experimentName, seed, storage }
 * @return {*}  {boolean}
 */
function sameLocalAndGivenSeed({ name: experimentName, seed, storage }) {
    const localSeed = storage.getItem(`ST-${experimentName}-seed`);
    return localSeed === seed;
}
