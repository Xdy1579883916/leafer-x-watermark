import type { ProcessorDataBase } from './ProcessorDataBase'
import type { ITileContentParser, IWatermark, IWatermarkInputData } from './types'
import { PropertyEvent, Rect } from '@leafer-ui/core'

export abstract class WatermarkBase<TConstructorData = IWatermarkInputData>
  extends Rect<TConstructorData> implements IWatermark {
  declare public __: ProcessorDataBase

  public tileContentParser?: ITileContentParser

  constructor(data?: TConstructorData) {
    super(data)
    this.syncParentSize = this.syncParentSize.bind(this)
    this.waitParent(() => {
      this.parent.on(PropertyEvent.CHANGE, this.syncParentSize)
      this.syncParentSize()
    })
  }

  public syncParentSize(e?: PropertyEvent) {
    if (e && !['width', 'height', 'x', 'y'].includes(e.attrName)) {
      return
    }
    if (this.__._tileMode && this.parent) {
      this.width = this.parent.width
      this.height = this.parent.height
      this.y = this.x = this.rotation = 0
      this.scaleX = this.scaleY = 1
    }
    else {
      // 关闭平铺时恢复默认尺寸
      this.width = this.__._cachedBounds?.width
      this.height = this.__._cachedBounds?.height
    }
  }

  public destroy(): void {
    if (this.parent) {
      this.parent.off(PropertyEvent.CHANGE, this.syncParentSize)
    }
    super.destroy()
  }
}
