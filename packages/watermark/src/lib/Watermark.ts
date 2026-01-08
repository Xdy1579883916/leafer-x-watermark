import type { Canvas } from '@leafer-ui/core'
import type {
  IImageInputData,
  IJSONOptions,
  IObject,
  IRectData,
  IRectInputData,
  IUI,
} from '@leafer-ui/interface'

import type { IStagger } from '../types/stagger'
import {
  boundsType,
  dataProcessor,
  Debug,
  isObject,
  Plugin,
  Rect,
  RectData,
  registerUI,
  UICreator,
} from '@leafer-ui/core'

const console = Debug.get('leafer-x-watermark')

// ==================== Types ====================
interface ITileGap {
  x?: number
  y?: number
}

export interface IWatermarkAttrData {
  tileContent?: string
  tileMode?: boolean
  tileSize?: number
  tileGap?: number | ITileGap
  tileStagger?: IStagger
  tileRotation?: number
}

export interface IProcessDataType extends IRectData {
  _tileContent?: string
  _tileMode?: boolean
  _tileSize?: number
  _tileGap?: number | ITileGap
  _tileStagger?: IStagger
  _tileRotation?: number
  _cachedUrl?: string
  _cachedBounds?: { width: number, height: number }

  updateFill: () => void
  regenerateImage: () => void
}

export interface IWatermark extends IWatermarkAttrData, IUI {
  __: IProcessDataType
}

export interface IWatermarkInputData extends IWatermarkAttrData, IRectInputData {
}

// ==================== Data Class ====================
export class ProcessorData extends RectData implements IProcessDataType {
  declare public __leaf: Watermark

  _tileContent?: string = ''
  _cachedUrl?: string
  _cachedBounds?: { width: number, height: number }

  setTileContent(value: string) {
    this._tileContent = value
    return this.regenerateImage()
  }

  _tileMode?: boolean = true

  setTileMode(value: boolean) {
    this._tileMode = value
    this.updateFill()
  }

  _tileSize?: number = 100

  setTileSize(value: number) {
    this._tileSize = value
    this.updateFill()
  }

  _tileGap?: number | ITileGap = 0

  setTileGap(value: number) {
    this._tileGap = value
    this.updateFill()
  }

  _tileStagger?: IStagger = 0

  setTileStagger(value: number) {
    this._tileStagger = value
    this.updateFill()
  }

  _tileRotation?: number = 0

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

  private createTileItem(itemData: object): IUI {
    return UICreator.get('Group', {
      children: [itemData],
      around: 'center',
    }) as IUI
  }

  public regenerateImage() {
    const leaf = this.__leaf
    const { _tileContent } = this
    const { width, height } = leaf

    if (!_tileContent) {
      this._cachedUrl = undefined
      this._cachedBounds = undefined
      leaf.fill = undefined
      return
    }

    let itemData: object
    try {
      itemData = JSON.parse(_tileContent)
    }
    catch (e) {
      console.error('Invalid tileContent JSON:', e)
      return
    }

    const tempItem = this.createTileItem(itemData)
    const { url, bounds } = this._simpleExport(tempItem)

    if (!width || !height) {
      leaf.width = bounds.width
      leaf.height = bounds.height
    }
    this._cachedUrl = url
    this._cachedBounds = bounds
    tempItem.destroy()
    this.updateFill()
  }

  public _simpleExport(ui: IUI) {
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

// ==================== Main Class ====================
@registerUI()
export class Watermark<TConstructorData = IWatermarkInputData> extends Rect<TConstructorData> implements IWatermark {
  get __tag() {
    return 'Watermark'
  }

  @dataProcessor(ProcessorData)
  declare public __: IProcessDataType

  @boundsType()
  declare tileContent?: string

  @boundsType(true)
  declare tileMode: boolean

  @boundsType(100)
  declare tileSize: number

  @boundsType(0)
  declare tileGap: number | {
    x?: number
    y?: number
  }

  @boundsType(0)
  declare tileStagger: IStagger

  @boundsType(0)
  declare tileRotation: number

  @boundsType(0)
  declare width: number

  @boundsType(0)
  declare height: number

  public get tileURL() {
    return this.__._cachedUrl
  }

  constructor(data?: TConstructorData) {
    super(data)
  }
}

Plugin.add('leafer-x-watermark')
