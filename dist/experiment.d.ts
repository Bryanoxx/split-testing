import type { Variant } from './types';
export declare function setExperiment({ experimentName, variants, seed, debug, onSetLocalVariant }: {
    experimentName: string;
    variants: Variant[];
    seed?: string;
    debug?: boolean;
    onSetLocalVariant?: (variant: Variant) => void;
}): void;
export declare function getLocalVariant(experimentName: string): Variant | null;
export declare function setLocalVariant({ experimentName, variants, seed, callback }: {
    experimentName: string;
    variants: Variant[];
    seed?: string;
    callback?: (variant: Variant) => void;
}): void;
export declare function sameLocalAndGivenSeed({ experimentName, seed }: {
    experimentName: string;
    seed: string | undefined;
}): boolean;
