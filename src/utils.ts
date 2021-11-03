import seedrandom from 'seedrandom'

let debug = false

/**
 * Define the state of the debug mode
 *
 * @export
 * @param {boolean} value
 */
export function defineDebugMode (value: boolean): void {
  debug = value
}

/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {...string[]} args
 */
export function log (...args: any[]): void {
  if (debug) {
    console.log('SplitTesting.js -', ...args)
  }
}

/**
 * Logs a warning message to the console
 *
 * @export
 * @param {...string[]} args
 */
export function warn (...args: any[]): void {
  console.warn('SplitTesting.js -', ...args)
}

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
export function getWeightedRandomElement<T> (collection: any[], seed?: string): T {
  let random: number = (seed !== undefined) ? seedrandom(seed).quick() : Math.random()
  const weightedRandomItem = collection.find(item => {
    if (random < item.weight) {
      return item
    } else {
      random -= item.weight
    }
  })
  return weightedRandomItem
}

/**
 * Deep clones all properties except Function and RegExp
 * Extracted and edited from https://www.npmjs.com/package/just-clone
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
export function clone (obj: any): any {
  if (typeof obj === 'function') {
    return obj
  }
  const result: any = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    const value = obj[key]
    const type = {}.toString.call(value).slice(8, -1)
    if (type === 'Array' || type === 'Object') {
      result[key] = clone(value)
    } else if (type === 'Date') {
      result[key] = new Date(value.getTime())
    } else {
      result[key] = value
    }
  }
  return result
}
