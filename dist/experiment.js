"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameLocalAndGivenSeed = exports.setLocalVariant = exports.getLocalVariantName = exports.setExperiment = void 0;
const utils_1 = require("./utils");
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
function setExperiment({ name, variants, seed, debug, onSetLocalVariant }) {
    // Configuration of the debug mode
    if (debug === true) {
        (0, utils_1.defineDebugMode)(true);
        (0, utils_1.log)('Running split testing with these options :');
        (0, utils_1.log)({ experimentName: name, variants, seed });
    }
    const localVariantName = getLocalVariantName(name);
    if (localVariantName === null) {
        // First-time user: picking his variant
        (0, utils_1.log)('Local variant does not exist, picking it...');
        setLocalVariant({
            experimentName: name,
            variants,
            seed,
            callback: onSetLocalVariant
        });
    }
    else {
        // The user already came: if provided, checking the seeds for having a consistent variant
        (0, utils_1.log)(`Local variant detected: ${localVariantName}`);
        if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName: name, seed })) {
            (0, utils_1.log)('Conflict between the local seed and the given seed, updating local variant');
            setLocalVariant({
                experimentName: name,
                variants,
                seed,
                callback: onSetLocalVariant
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
function getLocalVariantName(experimentName) {
    const localVariantName = localStorage.getItem(`${experimentName}-variant-name`);
    return localVariantName;
}
exports.getLocalVariantName = getLocalVariantName;
/**
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: (variant: Variant) => void }} { experimentName, variants, seed, callback }
 */
function setLocalVariant({ experimentName, variants, seed, callback }) {
    // Random picking of the variant (or constant if seed provided) and saving it in localStorage
    const randomIndex = (0, utils_1.getRandomIndex)(variants, seed);
    const randomVariant = variants[randomIndex];
    localStorage.setItem(`${experimentName}-variant-name`, randomVariant.name);
    (0, utils_1.log)(`New local variant: ${randomVariant.name} ${seed !== undefined ? '(with seed)' : ''}`);
    // Saving the seed if provided, for further verifications next time the user come
    if (seed !== undefined) {
        localStorage.setItem(`${experimentName}-seed`, seed);
    }
    // Executing the callback if provided
    if (callback !== undefined) {
        callback(randomVariant);
    }
}
exports.setLocalVariant = setLocalVariant;
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
