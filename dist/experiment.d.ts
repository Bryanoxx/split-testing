import type { Variant, ExperimentOptions } from './types';
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 * @return {*}  {boolean}
 */
export declare function setExperiment(options: ExperimentOptions): boolean;
/**
 * Get the picked variant's name
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(string | null)}
 */
export declare function getPickedVariantName(experimentName: string): string | null;
/**
 * Get all the details of the picked variant
 *
 * @export
 * @param {{ variantName: string, variants: Variant[]}} { variantName, variants }
 * @return {*}  {(Variant | undefined)}
 */
export declare function getPickedVariant({ experimentName, variants }: {
    experimentName: string;
    variants: Variant[];
}): Variant | undefined;
/**
 * Pick and save the variant of the experiment in localStorage
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
export declare function pickVariant({ experimentName, variants, seed, callback }: {
    experimentName: string;
    variants: Variant[];
    seed?: string;
    callback?: ExperimentOptions['onVariantPicked'];
}): void;
/**
 * Check if the local seed and the given seed are consistent.
 *
 * @export
 * @param {({ experimentName: string, seed: string | undefined })} { experimentName, seed }
 * @return {*}  {boolean}
 */
export declare function sameLocalAndGivenSeed({ experimentName, seed }: {
    experimentName: string;
    seed: string | undefined;
}): boolean;
/**
 * Reset the weight property of each variant for equal probability of being picked
 *
 * @export
 * @param {Variant[]} variants
 * @return {*}  {Variant[]}
 */
export declare function makeVariantsWithEqualWeights(variants: Variant[]): Variant[];
