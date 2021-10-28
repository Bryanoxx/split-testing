"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFromCallbackResults = exports.getRandomIndex = exports.log = exports.defineDebugMode = void 0;
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
        console.log(...args);
    }
}
exports.log = log;
/**
 * Return a random index from an array
 * A seed is possible in the goal of always returning the same index
 *
 * @export
 * @param {any[]} array
 * @param {string} [seed]
 * @return {*}  {number}
 */
function getRandomIndex(array, seed) {
    const random = (seed !== undefined) ? (0, seedrandom_1.default)(seed).quick() : Math.random();
    const randomIndex = Math.floor(random * array.length);
    return randomIndex;
}
exports.getRandomIndex = getRandomIndex;
/**
 * Returns an array of all the return values of the given function
 *
 * @export
 * @template T
 * @param {number} iteration
 * @param {() => T} callback
 * @return {*}  {T[]}
 */
function arrayFromCallbackResults(iteration, callback) {
    const results = [];
    for (let i = 0; i < iteration; i++) {
        results.push(callback());
    }
    return results;
}
exports.arrayFromCallbackResults = arrayFromCallbackResults;
