import type { Variant, ExperimentOptions } from './types'
import { getRandomIndex, defineDebugMode, log } from './utils'

/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
export function setExperiment ({ name, variants, seed, debug, onSetLocalVariant }: ExperimentOptions): void {
  // Configuration of the debug mode
  if (debug === true) {
    defineDebugMode(true)
    log('Running split testing with these options :')
    log({ experimentName: name, variants, seed })
  }

  const localVariantName = getLocalVariantName(name)
  if (localVariantName === null) {
    // First-time user: picking his variant
    log('Local variant does not exist, picking it...')
    setLocalVariant({
      experimentName: name,
      variants,
      seed,
      callback: onSetLocalVariant
    })
  } else {
    // The user already came: if provided, checking the seeds for having a consistent variant
    log(`Local variant detected: ${localVariantName}`)
    if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName: name, seed })) {
      log('Conflict between the local seed and the given seed, updating local variant')
      setLocalVariant({
        experimentName: name,
        variants,
        seed,
        callback: onSetLocalVariant
      })
    }
  }
}

/**
 * Get the local variant of the experiment.
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(Variant | null)}
 */
export function getLocalVariantName (experimentName: string): string | null {
  const localVariantName = localStorage.getItem(`${experimentName}-variant-name`)
  return localVariantName
}

/**
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: (variant: Variant) => void }} { experimentName, variants, seed, callback }
 */
export function setLocalVariant ({ experimentName, variants, seed, callback }: { experimentName: string, variants: Variant[], seed?: string, callback?: (variant: Variant) => void }): void {
  // Random picking of the variant (or constant if seed provided) and saving it in localStorage
  // TODO: take into account the weight of the variants
  const randomIndex = getRandomIndex(variants, seed)
  const randomVariant = variants[randomIndex]
  localStorage.setItem(`${experimentName}-variant-name`, randomVariant.name)
  log(`New local variant: ${randomVariant.name} ${seed !== undefined ? '(with seed)' : ''}`)

  // Saving the seed if provided, for further verifications next time the user come
  if (seed !== undefined) {
    localStorage.setItem(`${experimentName}-seed`, seed)
  } else {
    localStorage.removeItem(`${experimentName}-seed`)
  }

  // Executing the callback if provided
  if (callback !== undefined) {
    callback(randomVariant)
  }
}

/**
 * Check if the local seed and the given seed are consistent.
 *
 * @export
 * @param {({ experimentName: string, seed: string | undefined })} { experimentName, seed }
 * @return {*}  {boolean}
 */
export function sameLocalAndGivenSeed ({ experimentName, seed }: { experimentName: string, seed: string | undefined }): boolean {
  const localSeed = localStorage.getItem(`${experimentName}-seed`)
  return localSeed === seed
}
