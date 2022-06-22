/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {*} data
 * @param {boolean} isDebugging
 */
export declare function logger(data: any, isDebugging: boolean): void;
/**
 * Return the log function with a defined debugging state
 *
 * @export
 * @param {boolean} isDebugging
 * @return {*}  {(data: any) => void}
 */
export declare function makeLogger(isDebugging: boolean): (data: any) => void;
/**
 * Logs a warning message to the console
 *
 * @export
 * @param {*} data
 */
export declare function warningLogger(data: any): void;
/**
 * Create the error object of the library
 *
 * @export
 * @param {string} message
 * @return {*}  {Error}
 */
export declare function createError(message: string): Error;
/**
 * Deep clones all properties except Function and RegExp
 * Extracted and edited from https://www.npmjs.com/package/just-clone
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
export declare function deepClone(obj: any): any;
