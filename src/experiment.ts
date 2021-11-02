import type { Variant, ExperimentOptions } from './types'
import { getRandomIndex, defineDebugMode, log } from './utils'

/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
export function setExperiment ({ name, variants, seed, debug, onVariantPicked }: ExperimentOptions): void {
  // Configuration of the debug mode
  if (debug === true) {
    defineDebugMode(true)
    log('Running split testing with these options :')
    log({ experimentName: name, variants, seed })
  }

  const localVariantName = getPickedVariantName(name)
  if (localVariantName === null) {
    // First-time user: picking his variant
    log('Local variant does not exist, picking it...')
    setPickedVariant({
      experimentName: name,
      variants,
      seed,
      callback: onVariantPicked
    })
  } else {
    // The user already came: if provided, checking the seeds for having a consistent variant
    log(`Local variant detected: ${localVariantName}`)
    if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName: name, seed })) {
      log('Conflict between the local seed and the given seed, updating local variant')
      setPickedVariant({
        experimentName: name,
        variants,
        seed,
        callback: onVariantPicked
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
export function getPickedVariantName (experimentName: string): string | null {
  const pickedVariantName = localStorage.getItem(`${experimentName}-variant-name`)
  return pickedVariantName
}

/**
 * Get all the details of a variant with its name
 *
 * @export
 * @param {{ variantName: string, variants: Variant[]}} { variantName, variants }
 * @return {*}  {(Variant | undefined)}
 */
export function getPickedVariant ({ experimentName, variants }: { experimentName: string, variants: Variant[]}): Variant | undefined {
  // Name of the picked variant
  const pickedVariantName = getPickedVariantName(experimentName)
  if (pickedVariantName === null) {
    return undefined
  }
  // Finding details of the picked variant
  const pickedVariant = variants.find(variant => variant.name === pickedVariantName)
  return pickedVariant
}

/**
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
export function setPickedVariant ({ experimentName, variants, seed, callback }: { experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }): void {
  // Random picking of the variant (or constant if seed provided) and saving it in localStorage
  // TODO: take into account the weight of the variants
  const randomIndex = getRandomIndex(variants, seed)
  const pickedVariant = variants[randomIndex]
  localStorage.setItem(`${experimentName}-variant-name`, pickedVariant.name)
  log(`New local variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`)

  // Saving the seed if provided, for further verifications next time the user come
  if (seed !== undefined) {
    localStorage.setItem(`${experimentName}-seed`, seed)
  } else {
    localStorage.removeItem(`${experimentName}-seed`)
  }

  // Executing the callback if provided
  if (callback !== undefined) {
    callback(pickedVariant)
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
