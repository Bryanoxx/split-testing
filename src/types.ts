export interface WeightedItem {
  weight: number
  [name: string]: any
}

export interface Variant {
  name: string
  weight?: number
  data?: any
}

export interface WeightedVariant extends Variant {
  weight: number
}

export interface Storage {
  setItem: (key: string, value: string) => void
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
}

export interface ExperimentOptions {
  name: string
  variants: Variant[]
  seed?: string
  onFirstPicking?: (variant: Variant) => void
  storage: Storage
  isDebugMode?: boolean
  isResolvingSeedConflictAllowed?: boolean
}
