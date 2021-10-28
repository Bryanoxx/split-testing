export interface Variant {
  name: string
  weight?: number
}

export interface ExperimentOptions {
  name: string
  variants: Variant[]
  seed?: string
  debug?: boolean
  onSetLocalVariant?: (variant: Variant) => void
}
