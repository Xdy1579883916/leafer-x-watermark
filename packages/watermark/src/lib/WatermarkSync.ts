import type { Canvas } from '@leafer-ui/core'
import type { IUI } from '@leafer-ui/interface'
import type { IStagger } from '../types/stagger'
import type { ITileGap, IWatermarkInputData } from './base/types'

import { boundsType, dataProcessor, Plugin, registerUI, UICreator } from '@leafer-ui/core'
import { ProcessorDataBase } from './base/ProcessorDataBase'
import { WatermarkBase } from './base/WatermarkBase'

// ==================== Data Class (Sync) ====================
export class ProcessorData extends ProcessorDataBase {
  declare public __leaf: WatermarkSync

  public regenerateImage() {
    const itemData = this.parseAndValidateTileContent()
    if (!itemData)
      return

    const tempItem = this.createTileItem(itemData)
    const { url, bounds } = this._simpleExport(tempItem)

    this.updateLeafDimensions(bounds)
    tempItem.destroy()
    this.finalizeCachedData(url, bounds)
  }

  private _simpleExport(ui: IUI) {
    const exportWidth = 1000
    const bounds = ui.getBounds('render', 'local')

    const scaleRatio = exportWidth / bounds.width
    const scaledWidth = Math.floor(bounds.width * scaleRatio)
    const scaledHeight = Math.floor(bounds.height * scaleRatio)

    const canvas = UICreator.get('Canvas', {
      x: 0,
      y: 0,
      width: scaledWidth,
      height: scaledHeight,
    }) as Canvas
    canvas.draw(ui, undefined, scaleRatio)
    const url = canvas.canvas.toDataURL('image/png') as string
    canvas.destroy()
    return { url, bounds }
  }
}

// ==================== Main Class (Sync) ====================
@registerUI()
export class WatermarkSync<TConstructorData = IWatermarkInputData> extends WatermarkBase<TConstructorData> {
  get __tag() {
    return 'WatermarkSync'
  }

  @dataProcessor(ProcessorData)
  declare public __: ProcessorData

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
}

Plugin.add('leafer-x-watermark')
