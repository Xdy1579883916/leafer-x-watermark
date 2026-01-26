import type {
  IImageInputData,
  IJSONOptions,
  IObject,
} from '@leafer-ui/interface'

import type { INormalizedStagger, IStagger } from '../../types/stagger.ts'
import type { IProcessDataType, ITileGap } from './types'
import { isObject, RectData } from '@leafer-ui/core'

/** 标准化 stagger 参数 */
function normalizeStagger(stagger: IStagger): INormalizedStagger {
  if (typeof stagger === 'number') {
    return { type: 'x', offset: stagger }
  }
  return { type: stagger.type || 'x', offset: stagger.offset || 0 }
}

export abstract class ProcessorDataBase extends RectData implements IProcessDataType {
  declare public __leaf: any

  _cachedUrl?: string
  _cachedBounds?: { width: number, height: number }

  _tileURL?: string = ''
  _tileMode?: boolean = true
  _tileSize?: number = 100
  _tileGap?: number | ITileGap = 0
  _tileStagger?: IStagger = 0
  _tileRotation?: number = 0

  abstract regenerateImage(): void | Promise<void>

  setTileURL(value: string) {
    this._tileURL = value
    this.regenerateImage()
  }

  setTileMode(value: boolean) {
    this._tileMode = value
    this.updateFill()
    if (this.__leaf.syncParentSize)
      this.__leaf.syncParentSize()
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

      const interlace = normalizeStagger(_tileStagger)

      leaf.fill = {
        type: 'image',
        url: this._cachedUrl,
        mode: 'repeat',
        gap: { x: gapX, y: gapY },
        size: { width: sizeWidth, height: sizeHeight },
        interlace: {
          type: interlace.type || 'x',
          offset: {
            type: 'percent',
            // 为 0 时有bug，不渲染了，待修复。先手动改为1。
            value: (interlace.offset || 1) / 100,
          },
        },
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

  protected updateLeafDimensions(bounds: { width: number, height: number }) {
    const leaf = this.__leaf
    const { width, height } = leaf

    if (!width || !height) {
      leaf.width = bounds.width
      leaf.height = bounds.height
    }
  }
}
