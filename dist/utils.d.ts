/**
 * Define the state of the debug mode
 *
 * @export
 * @param {boolean} value
 */
export declare function defineDebugMode(value: boolean): void;
/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {...string[]} args
 */
export declare function log(...args: any[]): void;
/**
 * Logs a warning message to the console
 *
 * @export
 * @param {...string[]} args
 */
export declare function warn(...args: any[]): void;
/**
 * Deep clones an object
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
export declare function clone(obj: any): any;
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
export declare function getWeightedRandomElement<T>(collection: any[], seed?: string): T;
