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
    console.log(...args)
  }
}

/**
 * Return a random index from an array
 * A seed is possible in the goal of always returning the same index
 *
 * @export
 * @param {any[]} array
 * @param {string} [seed]
 * @return {*}  {number}
 */
export function getRandomIndex (array: any[], seed?: string): number {
  const random: number = (seed !== undefined) ? seedrandom(seed).quick() : Math.random()
  const randomIndex = Math.floor(random * array.length)
  return randomIndex
}

/**
 * Returns an array of all the return values of the given function
 *
 * @export
 * @template T
 * @param {number} iteration
 * @param {() => T} callback
 * @return {*}  {T[]}
 */
export function arrayFromCallbackResults<T> (iteration: number, callback: () => T): T[] {
  const results: T[] = []
  for (let i = 0; i < iteration; i++) {
    results.push(callback())
  }
  return results
}
