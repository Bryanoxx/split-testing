import type { WeightedItem } from '../types';
/**
 * Validate the `weight` property of every item in an array by checking if the total of all weight is equal to 1
 *
 * @export
 * @param {Array<Partial<WeightedItem>>} items
 * @return {*}  {boolean}
 */
export declare function validateWeightProperties(items: Array<Partial<WeightedItem>>): boolean;
/**
 * Send a new array with each item in equal probability of being picked
 *
 * @export
 * @template T
 * @param {T[]} items
 * @return {*}  {(Array<T & WeightedItem>)}
 */
export declare function makeWeightPropertiesEqual<T extends Partial<WeightedItem>>(items: T[]): Array<T & WeightedItem>;
/**
 * Return a random item from an array (with weighted probability)
 * A seed is possible in the goal of always returning the same item
 *
 * @export
 * @template T
 * @param {T[]} items
 * @param {string} [seed]
 * @return {*}  {T}
 */
export declare function getWeightedRandomElement<T extends Required<WeightedItem>>(items: T[], seed?: string): T;
