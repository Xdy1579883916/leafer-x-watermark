import type { IStagger } from '../types/stagger'
import type { ITileGap, IWatermarkInputData } from './base/types'
import { boundsType, Creator, dataProcessor, registerUI } from '@leafer-ui/core'
import { ProcessorDataBase } from './base/ProcessorDataBase'
import { WatermarkBase } from './base/WatermarkBase'

async function getBounds(url: string): Promise<{ data: string, bounds: { width: number, height: number } }> {
  return new Promise((resolve) => {
    const leaferImage = Creator.image({ url })
    leaferImage.load((image) => {
      const { width, height } = image
      resolve({ data: url, bounds: { width, height } })
    })
  })
}

// ==================== Data Class (URL) ====================
export class ProcessorData extends ProcessorDataBase {
  declare public __leaf: WatermarkURL

  public regenerateImage() {
    const url = this._tileURL
    if (!url) {
      this._cachedUrl = undefined
      this._cachedBounds = undefined
      this.__leaf.fill = undefined
      return
    }
    getBounds(url).then(({ data, bounds }) => {
      this._cachedUrl = data
      this._cachedBounds = bounds
      this.updateLeafDimensions(bounds)
      this.updateFill()
    })
  }
}

// ==================== Main Class (URL) ====================
@registerUI()
export class WatermarkURL<TConstructorData = IWatermarkInputData> extends WatermarkBase<TConstructorData> {
  get __tag() {
    return 'WatermarkURL'
  }

  @dataProcessor(ProcessorData)
  declare public __: ProcessorData

  @boundsType()
  declare tileURL?: string

  @boundsType(true)
  declare tileMode: boolean

  @boundsType(100)
  declare tileSize: number

  @boundsType(0)
  declare tileGap: number | ITileGap

  @boundsType(0)
  declare tileStagger: IStagger

  @boundsType(0)
  declare tileRotation: number
}
