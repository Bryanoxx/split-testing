"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = exports.createError = exports.warningLogger = exports.makeLogger = exports.logger = void 0;
/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {*} data
 * @param {boolean} isDebugging
 */
function logger(data, isDebugging) {
    if (isDebugging) {
        console.log('SplitTesting.js -', data);
    }
}
exports.logger = logger;
/**
 * Return the log function with a defined debugging state
 *
 * @export
 * @param {boolean} isDebugging
 * @return {*}  {(data: any) => void}
 */
function makeLogger(isDebugging) {
    return (data) => {
        logger(data, isDebugging);
    };
}
exports.makeLogger = makeLogger;
/**
 * Logs a warning message to the console
 *
 * @export
 * @param {*} data
 */
function warningLogger(data) {
    console.warn('SplitTesting.js -', data);
}
exports.warningLogger = warningLogger;
/**
 * Create the error object of the library
 *
 * @export
 * @param {string} message
 * @return {*}  {Error}
 */
function createError(message) {
    return new Error(`SplitTesting.js - ${message}`);
}
exports.createError = createError;
/**
 * Deep clones all properties except Function and RegExp
 * Extracted and edited from https://www.npmjs.com/package/just-clone
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
function deepClone(obj) {
    if (typeof obj === 'function') {
        return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        const value = obj[key];
        const type = {}.toString.call(value).slice(8, -1);
        if (type === 'Array' || type === 'Object') {
            result[key] = deepClone(value);
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
exports.deepClone = deepClone;
