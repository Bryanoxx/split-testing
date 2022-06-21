import type { Variant, ExperimentOptions, WeightedVariant } from './types'
import { validateWeightProperties, makeWeightPropertiesEqual, getWeightedRandomElement } from './utils/weight'
import { makeLogger, warningLogger, createError } from './utils/utils'

/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 * @return {*}  {boolean}
 */
export function setExperiment (options: ExperimentOptions): Variant {
  // Extraction of the options
  const experiment: ExperimentOptions = { ...options }
  experiment.variants = structuredClone(options.variants)
  experiment.isDebugMode = options.isDebugMode ?? false
  experiment.isResolvingSeedConflictAllowed = options.isResolvingSeedConflictAllowed ?? false
  if (window?.localStorage !== undefined) {
    experiment.storage = experiment.storage ?? window.localStorage
  }

  // Validation of the options
  if (typeof experiment.name !== 'string' || experiment.name.length === 0) {
    throw createError('The experiment name must be a non-empty string')
  }
  if (!Array.isArray(experiment.variants) || experiment.variants.length === 0) {
    throw createError('The variants must be an array of at least one element')
  }
  const variantsHaveNames = experiment.variants.every(variant => variant.name !== undefined && variant.name.length > 0)
  if (!variantsHaveNames) {
    throw createError('The variants must have a name')
  }

  // Configuration of the logget depending on the debug mode
  const logger = makeLogger(experiment.isDebugMode)
  logger('Running split testing with these options :')
  logger(experiment)

  // Picking the variant or verifying it if it exists
  const pickedVariant = getPickedVariant(experiment)
  if (pickedVariant === null) {
    // Picking the variant for the first time
    logger('No variant picked in storage, picking it now')
    const newlyPickedVariant = pickAndSetVariant(experiment, logger)
    if (experiment.onFirstPicking !== undefined) {
      experiment.onFirstPicking(newlyPickedVariant)
    }

    return newlyPickedVariant
  } else {
    // Verifying the variant coherencde if it already exists
    logger(`Variant already picked, named ${pickedVariant.name}`)

    // Checking if the variant name is valid
    if (getPickedVariant(experiment) === undefined) {
      throw createError(`The variant named ${pickedVariant.name} is not valid (not found in the variants)`)
    }

    // Checking the seed for having a consistent variant
    if (experiment.isResolvingSeedConflictAllowed && experiment.seed !== undefined && !sameLocalAndGivenSeed(experiment)) {
      warningLogger('Conflict between the old seed and the current seed, updating the variant for the current seed')
      const newlyPickedVariant = pickAndSetVariant(experiment, logger)
      return newlyPickedVariant
    }

    return pickedVariant
  }
}

/**
 * Get all the details of the picked variant from storage
 *
 * @param {ExperimentOptions} experiment
 * @return {*}  {(Variant | undefined)}
 */
function getPickedVariant (experiment: ExperimentOptions): Variant | null {
  // Name of the picked variant
  const pickedVariantName = experiment.storage.getItem(`ST-${experiment.name}-variant-name`)
  if (pickedVariantName === null) {
    return null
  }

  // Finding details of the picked variant
  const pickedVariant = experiment.variants.find(variant => variant.name === pickedVariantName)
  return pickedVariant ?? null
}

/**
 * Set the name and seed of the picked variant in storage
 *
 * @param {ExperimentOptions} { name: experimentName, storage, seed }
 * @param {Variant} pickedVariant
 * @param {ReturnType<typeof makeLogger>} log
 */
function setPickedVariant ({ name: experimentName, storage, seed }: ExperimentOptions, pickedVariant: Variant, log: ReturnType<typeof makeLogger>): void {
  storage.setItem(`ST-${experimentName}-variant-name`, pickedVariant.name)
  log(`New picked variant: ${pickedVariant.name} ${seed !== undefined ? '(with seed)' : ''}`)

  // Saving the seed if provided, for further verifications next time the user come
  if (seed !== undefined) {
    storage.setItem(`ST-${experimentName}-seed`, seed)
  } else {
    storage.removeItem(`ST-${experimentName}-seed`)
  }
}

/**
 * Pick and save the variant of the experiment in storage
 *
 * @param {ExperimentOptions} { name: experimentName, variants, storage, seed, onFirstPicking }
 * @param {ReturnType<typeof makeLogger>} log
 */
function pickAndSetVariant (
  experiment: ExperimentOptions,
  log: ReturnType<typeof makeLogger>
): Variant {
  // Extracting some properties
  const variants = experiment.variants
  const seed = experiment.seed

  // Validating the weight of the variants
  const areVariantsWellWeighted = validateWeightProperties(variants)
  const weightedVariants: WeightedVariant[] = areVariantsWellWeighted ? (variants as WeightedVariant[]) : makeWeightPropertiesEqual(variants)
  if (!areVariantsWellWeighted) {
    log('Making all weight equal so the variants have the same probability of being picked')
  }

  // Random picking of the variant (or constant if seed provided) and saving it in storage
  const pickedVariant = getWeightedRandomElement(weightedVariants, seed)
  setPickedVariant(experiment, pickedVariant, log)

  return pickedVariant
}

/**
 * Check if the local seed and the given seed are consistent.
 *
 * @param {ExperimentOptions} { name: experimentName, seed, storage }
 * @return {*}  {boolean}
 */
function sameLocalAndGivenSeed ({ name: experimentName, seed, storage }: ExperimentOptions): boolean {
  const localSeed = storage.getItem(`ST-${experimentName}-seed`)
  return localSeed === seed
}
