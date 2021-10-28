"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameLocalAndGivenSeed = exports.setLocalVariant = exports.getLocalVariant = exports.setExperiment = void 0;
const utils_1 = require("./utils");
function setExperiment({ experimentName, variants, seed, debug, onSetLocalVariant }) {
    // Configuration of the debug mode
    if (debug === true) {
        (0, utils_1.defineDebugMode)(true);
    }
    (0, utils_1.log)('Running A/B testing with these options');
    (0, utils_1.log)({ experimentName, variants, seed });
    const localVariant = getLocalVariant(experimentName);
    if (localVariant === null) {
        // First-time user: picking his variant
        (0, utils_1.log)('Local variant does not exist, picking it...');
        setLocalVariant({
            experimentName,
            variants,
            seed,
            callback: onSetLocalVariant
        });
    }
    else {
        // The user already came: if provided, checking the seeds for having a consistent variant
        (0, utils_1.log)(`Local variant detected: ${localVariant.name}`);
        if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName, seed })) {
            (0, utils_1.log)('Conflict between the local seed and the given seed, updating local variant');
            setLocalVariant({
                experimentName,
                variants,
                seed,
                callback: onSetLocalVariant
            });
        }
    }
}
exports.setExperiment = setExperiment;
function getLocalVariant(experimentName) {
    const localVariant = localStorage.getItem(`${experimentName}-variant`);
    return localVariant === null ? null : JSON.parse(localVariant);
}
exports.getLocalVariant = getLocalVariant;
function setLocalVariant({ experimentName, variants, seed, callback }) {
    // Random picking of the variant (or constant if seed provided) and setting it in localStorage
    const randomIndex = (0, utils_1.getRandomIndex)(variants, seed);
    const localVariant = variants[randomIndex];
    localStorage.setItem(`${experimentName}-variant`, JSON.stringify(localVariant));
    (0, utils_1.log)(`New local variant: ${localVariant.name} ${seed !== undefined ? '(with seed)' : ''}`);
    // Saving the seed if provided
    if (seed !== undefined) {
        localStorage.setItem(`${experimentName}-seed`, seed);
    }
    // Executing the callback if provided
    if (callback !== undefined) {
        callback(localVariant);
    }
}
exports.setLocalVariant = setLocalVariant;
function sameLocalAndGivenSeed({ experimentName, seed }) {
    const localSeed = localStorage.getItem(`${experimentName}-seed`);
    return localSeed === seed;
}
exports.sameLocalAndGivenSeed = sameLocalAndGivenSeed;
