"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.getWeightedRandomElement = exports.error = exports.warn = exports.log = exports.defineDebugMode = void 0;
const seedrandom_1 = __importDefault(require("seedrandom"));
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
 * Logs a warning message to the console
 *
 * @export
 * @param {...string[]} args
 */
function error(...args) {
    console.error('SplitTesting.js -', ...args);
}
exports.error = error;
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
/**
 * Deep clones all properties except Function and RegExp
 * Extracted and edited from https://www.npmjs.com/package/just-clone
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
function clone(obj) {
    if (typeof obj === 'function') {
        return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        const value = obj[key];
        const type = {}.toString.call(value).slice(8, -1);
        if (type === 'Array' || type === 'Object') {
            result[key] = clone(value);
        }
        else if (type === 'Date') {
            result[key] = new Date(value.getTime());
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
exports.clone = clone;
