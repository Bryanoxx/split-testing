import type { Variant, ExperimentOptions } from './types'
import { defineDebugMode, log, warn, clone, getWeightedRandomElement } from './utils'

/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 */
export function setExperiment (options: ExperimentOptions): void {
  // Extraction des options
  const { name: experimentName, seed, debug, onVariantPicked } = options
  const variants = clone(options.variants)

  // Configuration of the debug mode
  if (debug === true) {
    defineDebugMode(true)
    log('Running split testing with these options :')
    log({ experimentName, variants: options.variants, seed, debug })
  }

  const pickedVariantName = getPickedVariantName(experimentName)
  if (pickedVariantName === null) {
    // First-time user: picking his variant
    log('No variant picked in localStorage, picking it...')
    pickVariant({
      experimentName,
      variants,
      seed,
      callback: onVariantPicked
    })
  } else {
    // The user already came: if provided, checking the seeds for having a consistent variant
    log(`Variant detected in localStorage: ${pickedVariantName}`)
    if (seed !== undefined && !sameLocalAndGivenSeed({ experimentName, seed })) {
      log('Conflict between the old seed and the current seed, updating the variant for the current seed')
      pickVariant({
        experimentName,
        variants,
        seed,
        callback: onVariantPicked
      })
    }
  }
}

/**
 * Get the picked variant's name
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(string | null)}
 */
export function getPickedVariantName (experimentName: string): string | null {
  const pickedVariantName = localStorage.getItem(`${experimentName}-variant-name`)
  return pickedVariantName
}

/**
 * Get all the details of the picked variant
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
 * Pick and save the variant of the experiment in localStorage
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
export function pickVariant ({ experimentName, variants, seed, callback }: { experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }): void {
  // Extracting weight-related variables
  const hasWeight = variants.some(variant => variant.weight !== undefined)
  const everyHasWeight = variants.every(variant => variant.weight !== undefined)
  const totalWeight = variants.reduce((acc, variant) => acc + (variant.weight ?? 0), 0)

  // Validating the weigh of the variants
  if (hasWeight && !everyHasWeight) {
    warn('SplitTesting.js: Some variants have a weight but not all of them, reset of all weight')
    variants = makeVariantsWithEqualWeights(variants)
  } else if (everyHasWeight && totalWeight !== 1) {
    warn('SplitTesting.js: The total of all weight is not equal to 1, reset of all weight')
    variants = makeVariantsWithEqualWeights(variants)
  } else if (!hasWeight) {
    // All the variant don't have a weight property
    variants = makeVariantsWithEqualWeights(variants)
  }

  // Random picking of the variant (or constant if seed provided) and saving it in localStorage
  const pickedVariant = getWeightedRandomElement<Variant>(variants, seed)
  localStorage.setItem(`${experimentName}-variant-name`, pickedVariant.name)
  log(`New picked variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`)

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

/**
 * Reset the weight property of each variant for equal probability of being picked
 *
 * @export
 * @param {Variant[]} variants
 * @return {*}  {Variant[]}
 */
export function makeVariantsWithEqualWeights (variants: Variant[]): Variant[] {
  log('Making all weight equal so the variants have the same probability of being picked')
  const weightValue = 1 / variants.length
  const newVariants = variants.map(variant => {
    variant.weight = weightValue
    return variant
  })
  return newVariants
}
