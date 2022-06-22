"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeightedRandomElement = exports.makeWeightPropertiesEqual = exports.validateWeightProperties = void 0;
const utils_1 = require("./utils");
/**
 * Validate the `weight` property of every item in an array by checking if the total of all weight is equal to 1
 *
 * @export
 * @param {Array<Partial<WeightedItem>>} items
 * @return {*}  {boolean}
 */
function validateWeightProperties(items) {
    // Extracting weight-related variables
    const hasWeight = items.some(item => item.weight !== undefined);
    const everyHasWeight = items.every(item => item.weight !== undefined);
    const totalWeight = items.reduce((acc, item) => { var _a; return acc + ((_a = item.weight) !== null && _a !== void 0 ? _a : 0); }, 0);
    // Validating the weigh of the variants
    if (hasWeight && !everyHasWeight) {
        (0, utils_1.warningLogger)('Some items have a weight but not all of them, reset of all weight');
        return false;
    }
    else if (everyHasWeight && totalWeight !== 1) {
        (0, utils_1.warningLogger)('The total of all weight is not equal to 1, reset of all weight');
        return false;
    }
    else if (!hasWeight) {
        // No weight properties at all
        return false;
    }
    // All the variant have a weight property that are coherent
    return true;
}
exports.validateWeightProperties = validateWeightProperties;
/**
 * Send a new array with each item in equal probability of being picked
 *
 * @export
 * @template T
 * @param {T[]} items
 * @return {*}  {(Array<T & WeightedItem>)}
 */
function makeWeightPropertiesEqual(items) {
    const weightValue = 1 / items.length;
    const newItems = items.map(item => {
        item.weight = weightValue;
        return item;
    });
    return newItems;
}
exports.makeWeightPropertiesEqual = makeWeightPropertiesEqual;
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
function getWeightedRandomElement(items, seed) {
    let random = (seed !== undefined) ? getSeededRandom(seed) : Math.random();
    const weightedRandomItem = items.find(item => {
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
 * Return always the same number between 0 and 1 from the same string
 * Here's how : http://indiegamr.com/generate-repeatable-random-numbers-in-js/
 *
 * @param {string} seed
 * @return {*}  {number}
 */
function getSeededRandom(seed) {
    const seedInNumber = seed.split('').map(char => char.charCodeAt(0)).reduce((acc, char) => acc + char, 0);
    const calcSeed = (seedInNumber * 9301 + 49297) % 233280;
    const random = calcSeed / 233280;
    return random;
}
