import type { Variant, ExperimentOptions } from './types';
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} { name, variants, seed, debug, onSetLocalVariant }
 */
export declare function setExperiment({ name, variants, seed, debug, onSetLocalVariant }: ExperimentOptions): void;
/**
 * Get the local variant of the experiment.
 *
 * @export
 * @param {string} experimentName
 * @return {*}  {(Variant | null)}
 */
export declare function getLocalVariantName(experimentName: string): string | null;
/**
 * Set the local variant of the experiment.
 *
 * @export
 * @param {{ experimentName: string, variants: Variant[], seed?: string, callback?: (variant: Variant) => void }} { experimentName, variants, seed, callback }
 */
export declare function setLocalVariant({ experimentName, variants, seed, callback }: {
    experimentName: string;
    variants: Variant[];
    seed?: string;
    callback?: (variant: Variant) => void;
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
