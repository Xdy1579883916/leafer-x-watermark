import type { ProcessorDataBase } from './ProcessorDataBase'
import type { IWatermark, IWatermarkInputData } from './types'
import { Rect } from '@leafer-ui/core'

export abstract class WatermarkBase<TConstructorData = IWatermarkInputData>
  extends Rect<TConstructorData> implements IWatermark {
  declare public __: ProcessorDataBase

  public get tileURL() {
    return this.__._cachedUrl
  }
}
