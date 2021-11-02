import type { Variant, ExperimentOptions } from './types';
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
export declare function setExperiment({ name, variants, seed, debug, onVariantPicked }: ExperimentOptions): void;
/**
 * Get the local variant of the experiment.
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(Variant | null)}
 */
export declare function getPickedVariantName(experimentName: string): string | null;
/**
 * Get all the details of a variant with its name
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
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: ExperimentOptions['onVariantPicked'] }} { experimentName, variants, seed, callback }
 */
export declare function setPickedVariant({ experimentName, variants, seed, callback }: {
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
