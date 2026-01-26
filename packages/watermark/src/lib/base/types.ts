import type {
  IRectData,
  IRectInputData,
  IUI,
} from '@leafer-ui/interface'

import type { IStagger } from '../../types/stagger'

// ==================== Types ====================
export type ITileContentParser = (content: string) => object | null

export interface ITileGap {
  x?: number
  y?: number
}

export interface IWatermarkAttrData {
  tileContent?: string
  tileURL?: string
  tileMode?: boolean
  tileSize?: number
  tileGap?: number | ITileGap
  tileStagger?: IStagger
  tileRotation?: number
}

export interface IProcessDataType extends IRectData {
  _tileURL?: string
  _tileMode?: boolean
  _tileSize?: number
  _tileGap?: number | ITileGap
  _tileStagger?: IStagger
  _tileRotation?: number
  _cachedUrl?: string
  _cachedBounds?: { width: number, height: number }

  updateFill: () => void
  regenerateImage: () => void | Promise<void>
}

export interface IWatermark extends IWatermarkAttrData, IUI {
  __: IProcessDataType
  tileContentParser?: ITileContentParser
}

export interface IWatermarkInputData extends IWatermarkAttrData, IRectInputData {
}
