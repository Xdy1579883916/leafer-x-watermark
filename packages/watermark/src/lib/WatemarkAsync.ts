import type { IStagger } from '../types/stagger'
import type { ITileGap, IWatermarkInputData } from './base/types'
import { boundsType, dataProcessor, registerUI } from '@leafer-ui/core'
import { ProcessorDataBase } from './base/ProcessorDataBase'
import { WatermarkBase } from './base/WatermarkBase'

// ==================== Data Class (Async) ====================
export class ProcessorDataAsync extends ProcessorDataBase {
  declare public __leaf: WatermarkAsync

  // 异步版本需要覆盖，以便正确 await
  async setTileContent(value: string) {
    this._tileContent = value
    await this.regenerateImage()
  }

  public async regenerateImage() {
    const itemData = this.parseAndValidateTileContent()
    if (!itemData)
      return

    const tempItem = this.createTileItem(itemData)
    const bounds = tempItem.getBounds('box', 'local')

    this.updateLeafDimensions(bounds)

    const exportWidth = 1000
    const { data: url } = await tempItem.export('png', {
      blob: false,
      size: { width: exportWidth },
    })

    tempItem.destroy()
    this.finalizeCachedData(url as string, bounds)
  }
}

// ==================== Main Class (Async) ====================
@registerUI()
export class WatermarkAsync<TConstructorData = IWatermarkInputData> extends WatermarkBase<TConstructorData> {
  get __tag() {
    return 'WatermarkAsync'
  }

  @dataProcessor(ProcessorDataAsync)
  declare public __: ProcessorDataAsync

  @boundsType()
  declare tileContent?: string

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

  public get tileURL() {
    return this.__._cachedUrl
  }
}
