export interface Variant {
  name: string
  weight?: number
  data?: any
}

export interface ExperimentOptions {
  name: string
  variants: Variant[]
  seed?: string
  debug?: boolean
  resolveSeedConflict?: boolean
  onVariantPicked?: (variant: Variant) => void
}
