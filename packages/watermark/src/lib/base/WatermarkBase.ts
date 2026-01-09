import type { ProcessorDataBase } from './ProcessorDataBase'
import type { IWatermark, IWatermarkInputData } from './types'
import { PropertyEvent, Rect } from '@leafer-ui/core'

export abstract class WatermarkBase<TConstructorData = IWatermarkInputData>
  extends Rect<TConstructorData> implements IWatermark {
  declare public __: ProcessorDataBase

  constructor(data?: TConstructorData) {
    super(data)
    this.syncParentSize = this.syncParentSize.bind(this)
    this.waitParent(() => {
      this.parent.on(PropertyEvent.CHANGE, this.syncParentSize)
      this.syncParentSize()
    })
  }

  public syncParentSize(e?: PropertyEvent) {
    if (e && !['width', 'height'].includes(e.attrName)) {
      return
    }
    if (this.__._tileMode && this.parent) {
      this.width = this.parent.width
      this.height = this.parent.height
      this.y = this.x = 0
    }
  }

  public destroy(): void {
    if (this.parent) {
      this.parent.off(PropertyEvent.CHANGE, this.syncParentSize)
    }
    super.destroy()
  }
}
