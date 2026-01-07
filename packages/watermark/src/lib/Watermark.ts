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
  Platform,
  Plugin,
  Rect,
  RectData,
  registerUI,
  UICreator,
} from '@leafer-ui/core'
import { installStaggerPattern } from '../stagger'
import '../types/stagger'

installStaggerPattern()

const debug = Debug.get('leafer-x-watermark')

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
  _tileGap?: number
  _tileStagger?: number
  _tileRotation?: number
}

export interface IWatermark extends IWatermarkAttrData, IUI {
  __: IProcessDataType
}

export interface IWatermarkInputData extends IWatermarkAttrData, IRectInputData {
}

// ==================== Data Class ====================
export class ProcessorData extends RectData implements IProcessDataType {
  declare public __leaf: Watermark

  _tileContent?: string

  setTileContent(value: string) {
    this._tileContent = value
    this.__leaf.regenerateImage()
  }

  _tileMode?: boolean

  setTileMode(value: boolean) {
    this._tileMode = value
    this.__leaf.updateFill()
  }

  _tileSize?: number

  setTileSize(value: number) {
    this._tileSize = value
    this.__leaf.updateFill()
  }

  _tileGap?: number

  setTileGap(value: number) {
    this._tileGap = value
    this.__leaf.updateFill()
  }

  _tileStagger?: number

  setTileStagger(value: number) {
    this._tileStagger = value
    this.__leaf.updateFill()
  }

  _tileRotation?: number

  setTileRotation(value: number) {
    this._tileRotation = value
    this.__leaf.updateFill()
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

  // 缓存导出的图片和尺寸信息
  private _cachedUrl?: string
  private _cachedBounds?: { width: number, height: number }

  constructor(data?: TConstructorData) {
    super(data)
    this.regenerateImage()
  }

  private createTileItem(itemData: object): IUI {
    return UICreator.get('Group', {
      children: [itemData],
      // rotation: this.tileRotation,
      around: 'center',
    }) as IUI
  }

  public regenerateImage() {
    Platform.requestRender(async () => {
      const { tileContent, width, height } = this

      if (!tileContent) {
        this._cachedUrl = undefined
        this._cachedBounds = undefined
        this.fill = undefined
        return
      }

      let itemData: object
      try {
        itemData = JSON.parse(tileContent)
      }
      catch (e) {
        debug.error('Invalid tileContent JSON:', e)
        return
      }

      const tempItem = this.createTileItem(itemData)
      const bounds = tempItem.getBounds('box', 'local')

      if (!width || !height) {
        this.width = bounds.width
        this.height = bounds.height
      }

      const exportWidth = 1000
      const { data: url } = await tempItem.export('png', {
        blob: false,
        size: { width: exportWidth },
      })

      this._cachedUrl = url as string
      this._cachedBounds = { width: bounds.width, height: bounds.height }

      tempItem.destroy()

      this.updateFill()
    })
  }

  public updateFill() {
    Platform.requestRender(() => {
      const { tileMode, tileSize, tileGap, tileStagger } = this

      if (!this._cachedUrl || !this._cachedBounds || tileSize <= 0) {
        this.fill = undefined
        return
      }
      const { width: boundsWidth, height: boundsHeight } = this._cachedBounds

      if (!tileMode) {
        this.fill = {
          type: 'image',
          url: this._cachedUrl,
          mode: 'stretch',
        }
      }
      else {
        const scale = tileSize / 100
        const sizeWidth = boundsWidth * scale
        const sizeHeight = boundsHeight * scale
        let xGap: number, yGap: number
        if (isObject(tileGap)) {
          xGap = tileGap.x
          yGap = tileGap.y
        }
        else {
          xGap = yGap = tileGap
        }

        const gapX = (xGap / 100) * sizeWidth
        const gapY = (yGap / 100) * sizeHeight

        this.fill = {
          type: 'image',
          url: this._cachedUrl,
          mode: 'repeat',
          gap: { x: gapX, y: gapY },
          size: { width: sizeWidth, height: sizeHeight },
          stagger: tileStagger,
          rotation: this.tileRotation,
          align: 'center',
        }
      }
    })
  }
}

Plugin.add('leafer-x-watermark')
