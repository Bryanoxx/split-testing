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
 * Return a random index from an array
 * A seed is possible in the goal of always returning the same index
 *
 * @export
 * @param {any[]} array
 * @param {string} [seed]
 * @return {*}  {number}
 */
export declare function getRandomIndex(array: any[], seed?: string): number;
/**
 * Returns an array of all the return values of the given function
 *
 * @export
 * @template T
 * @param {number} iteration
 * @param {() => T} callback
 * @return {*}  {T[]}
 */
export declare function arrayFromCallbackResults<T>(iteration: number, callback: () => T): T[];
