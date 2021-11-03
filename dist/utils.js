"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightedRandomElement = exports.clone = exports.warn = exports.log = exports.defineDebugMode = void 0;
const seedrandom_1 = __importDefault(require("seedrandom"));
const just_clone_1 = __importDefault(require("just-clone"));
let debug = false;
/**
 * Define the state of the debug mode
 *
 * @export
 * @param {boolean} value
 */
function defineDebugMode(value) {
    debug = value;
}
exports.defineDebugMode = defineDebugMode;
/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {...string[]} args
 */
function log(...args) {
    if (debug) {
        console.log('SplitTesting.js -', ...args);
    }
}
exports.log = log;
/**
 * Logs a warning message to the console
 *
 * @export
 * @param {...string[]} args
 */
function warn(...args) {
    console.warn('SplitTesting.js -', ...args);
}
exports.warn = warn;
/**
 * Deep clones an object
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
function clone(obj) {
    return (0, just_clone_1.default)(obj);
}
exports.clone = clone;
/**
 * Return a random item from an array (with weighted probability)
 * A seed is possible in the goal of always returning the same item
 *
 * @export
 * @template T
 * @param {any[]} collection
 * @param {string} [seed]
 * @return {*}  {T}
 */
function getWeightedRandomElement(collection, seed) {
    let random = (seed !== undefined) ? (0, seedrandom_1.default)(seed).quick() : Math.random();
    const weightedRandomItem = collection.find(item => {
        if (random < item.weight) {
            return item;
        }
        else {
            random -= item.weight;
        }
    });
    return weightedRandomItem;
}
exports.getWeightedRandomElement = getWeightedRandomElement;
