import type {
  IImageInputData,
  IJSONOptions,
  IObject,
  IUI,
} from '@leafer-ui/interface'

import type { IProcessDataType, ITileGap } from './types'
import { Debug, isObject, RectData, UICreator } from '@leafer-ui/core'

const console = Debug.get('leafer-x-watermark')

export abstract class ProcessorDataBase extends RectData implements IProcessDataType {
  declare public __leaf: any

  _cachedUrl?: string
  _cachedBounds?: { width: number, height: number }

  _tileContent?: string = ''
  _tileURL?: string = ''
  _tileMode?: boolean = true
  _tileSize?: number = 100
  _tileGap?: number | ITileGap = 0
  _tileStagger?: number = 0
  _tileRotation?: number = 0

  abstract regenerateImage(): void | Promise<void>

  setTileContent(value: string) {
    this._tileContent = value
    this.regenerateImage()
  }

  setTileURL(value: string) {
    this._tileURL = value
    this.regenerateImage()
  }

  setTileMode(value: boolean) {
    this._tileMode = value
    this.updateFill()
  }

  setTileSize(value: number) {
    this._tileSize = value
    this.updateFill()
  }

  setTileGap(value: number | ITileGap) {
    this._tileGap = value
    this.updateFill()
  }

  setTileStagger(value: number) {
    this._tileStagger = value
    this.updateFill()
  }

  setTileRotation(value: number) {
    this._tileRotation = value
    this.updateFill()
  }

  public updateFill() {
    const leaf = this.__leaf
    const { _tileMode, _tileSize, _tileGap, _tileStagger, _tileRotation } = this

    if (!this._cachedUrl || !this._cachedBounds || _tileSize <= 0) {
      leaf.fill = undefined
      return
    }
    const { width: boundsWidth, height: boundsHeight } = this._cachedBounds

    if (!_tileMode) {
      leaf.fill = {
        type: 'image',
        url: this._cachedUrl,
        mode: 'stretch',
      }
    }
    else {
      const scale = _tileSize / 100
      const sizeWidth = boundsWidth * scale
      const sizeHeight = boundsHeight * scale
      let xGap: number, yGap: number
      if (isObject(_tileGap)) {
        xGap = _tileGap.x
        yGap = _tileGap.y
      }
      else {
        xGap = yGap = _tileGap as number
      }

      const gapX = (xGap / 100) * sizeWidth
      const gapY = (yGap / 100) * sizeHeight

      leaf.fill = {
        type: 'image',
        url: this._cachedUrl,
        mode: 'repeat',
        gap: { x: gapX, y: gapY },
        size: { width: sizeWidth, height: sizeHeight },
        stagger: _tileStagger,
        rotation: _tileRotation,
        align: 'center',
      }
    }
  }

  public __getData(): IObject {
    const data: IImageInputData = super.__getData()
    delete data.fill
    return data
  }

  public __getInputData(names?: string[] | IObject, options?: IJSONOptions): IObject {
    const data: IImageInputData = super.__getInputData(names, options)
    delete data.fill
    return data
  }

  protected createTileItem(itemData: object): IUI {
    return UICreator.get('Group', {
      children: [itemData],
      around: 'center',
    }) as IUI
  }

  protected parseAndValidateTileContent(): object | null {
    const { _tileContent } = this

    if (!_tileContent) {
      this._cachedUrl = undefined
      this._cachedBounds = undefined
      this.__leaf.fill = undefined
      return null
    }

    try {
      return JSON.parse(_tileContent)
    }
    catch (e) {
      console.error('Invalid tileContent JSON:', e)
      return null
    }
  }

  protected updateLeafDimensions(bounds: { width: number, height: number }) {
    const leaf = this.__leaf
    const { width, height } = leaf

    if (!width || !height) {
      leaf.width = bounds.width
      leaf.height = bounds.height
    }
  }

  protected finalizeCachedData(url: string, bounds: { width: number, height: number }) {
    this._cachedUrl = url
    this._cachedBounds = bounds
    this.updateFill()
  }
}
