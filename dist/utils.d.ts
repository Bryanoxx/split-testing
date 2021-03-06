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
 * Logs a warning message to the console
 *
 * @export
 * @param {...string[]} args
 */
export declare function error(...args: any[]): void;
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
/**
 * Return always the same number between 0 and 1 from the same string
 * Here's how : http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 *
 * @export
 * @param {string} seed
 * @return {*}  {number}
 */
export declare function getSeededRandom(seed: string): number;
/**
 * Deep clones all properties except Function and RegExp
 * Extracted and edited from https://www.npmjs.com/package/just-clone
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
export declare function clone(obj: any): any;
