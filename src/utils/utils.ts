/**
 * Logs a message to the console if debug is enabled.
 *
 * @export
 * @param {*} data
 * @param {boolean} isDebugging
 */
export function logger (data: any, isDebugging: boolean): void {
  if (isDebugging) {
    console.log('SplitTesting.js -', data)
  }
}

/**
 * Return the log function with a defined debugging state
 *
 * @export
 * @param {boolean} isDebugging
 * @return {*}  {(data: any) => void}
 */
export function makeLogger (isDebugging: boolean): (data: any) => void {
  return (data: any) => {
    logger(data, isDebugging)
  }
}

/**
 * Logs a warning message to the console
 *
 * @export
 * @param {*} data
 */
export function warningLogger (data: any): void {
  console.warn('SplitTesting.js -', data)
}

/**
 * Create the error object of the library
 *
 * @export
 * @param {string} message
 * @return {*}  {Error}
 */
export function createError (message: string): Error {
  return new Error(`SplitTesting.js - ${message}`)
}
