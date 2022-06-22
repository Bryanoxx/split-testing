import type { Variant, ExperimentOptions } from './types';
/**
 * Configure a split testing experiment with the given options.
 *
 * @export
 * @param {ExperimentOptions} options
 * @return {*}  {boolean}
 */
export declare function setExperiment(options: ExperimentOptions): Variant;
