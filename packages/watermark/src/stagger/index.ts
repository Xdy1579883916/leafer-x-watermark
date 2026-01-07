import type { ILeaferCanvas, ILeafPaint, IMatrixData, IRenderOptions, IUI } from '@leafer-ui/interface'
import type { INormalizedStagger, IStagger } from '../types/stagger'
import { MathHelper, MatrixHelper, PaintImage, Platform } from '@leafer-ui/core'

const { get, scale, copy } = MatrixHelper
const { getFloorScale } = MathHelper
const { abs } = Math

/** 保存原始的 createPattern 方法 */
const originalCreatePattern = PaintImage.createPattern.bind(PaintImage)

/** 标准化 stagger 参数 */
function normalizeStagger(stagger: IStagger): INormalizedStagger {
  if (typeof stagger === 'number') {
    return { type: 'x', offset: stagger }
  }
  return { type: stagger.type || 'x', offset: stagger.offset || 0 }
}

/** 创建带交错的 pattern canvas */
function createStaggerCanvas(
  image: any,
  imgWidth: number,
  imgHeight: number,
  xGap: number,
  yGap: number,
  stagger: INormalizedStagger,
  opacity?: number,
  smooth?: boolean,
): HTMLCanvasElement {
  // 单元格尺寸（图片 + 间距）
  const unitWidth = imgWidth + xGap
  const unitHeight = imgHeight + yGap

  const isXStagger = stagger.type === 'x'

  // 计算 pattern 单元尺寸
  // X 方向交错：高度翻倍（包含两行）
  // Y 方向交错：宽度翻倍（包含两列）
  const patternWidth = isXStagger ? unitWidth : unitWidth * 2
  const patternHeight = isXStagger ? unitHeight * 2 : unitHeight

  const canvas = Platform.origin.createCanvas(
    Math.max(Math.floor(patternWidth), 1),
    Math.max(Math.floor(patternHeight), 1),
  )
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  if (opacity && opacity < 1)
    ctx.globalAlpha = opacity
  ctx.imageSmoothingEnabled = smooth !== false

  const imgView = image.view

  // 绘制函数：在指定位置绘制图片
  const drawImg = (x: number, y: number) => {
    ctx.drawImage(imgView, 0, 0, image.width, image.height, x, y, imgWidth, imgHeight)
  }

  // 计算交错偏移像素（基于单元格尺寸）
  const offset = (stagger.offset / 100) * (isXStagger ? unitWidth : unitHeight)

  if (isXStagger) {
    // X 方向交错：绘制两行，第二行 X 方向偏移
    // 第一行 (y = 0)
    drawImg(0, 0)
    // 第二行 (y = unitHeight)，X 方向偏移
    drawImg(offset, unitHeight)
    // 补画溢出部分
    if (offset + imgWidth > unitWidth) {
      drawImg(offset - unitWidth, unitHeight)
    }
  }
  else {
    // Y 方向交错：绘制两列，第二列 Y 方向偏移
    // 第一列 (x = 0)
    drawImg(0, 0)
    // 第二列 (x = unitWidth)，Y 方向偏移
    drawImg(unitWidth, offset)
    // 补画溢出部分
    if (offset + imgHeight > unitHeight) {
      drawImg(unitWidth, offset - unitHeight)
    }
  }

  return canvas
}

/** 带交错支持的 createPattern */
function createPatternWithStagger(
  paint: ILeafPaint,
  ui: IUI,
  canvas: ILeaferCanvas,
  renderOptions: IRenderOptions,
): void {
  // stagger 在 originPaint 中，不在 data 中
  const originPaint = paint.originPaint as any
  const rawStagger = originPaint?.stagger

  // 如果没有 stagger，使用原始方法
  if (rawStagger === undefined || rawStagger === 0) {
    originalCreatePattern(paint, ui, canvas, renderOptions)
    return
  }

  const stagger = normalizeStagger(rawStagger)

  // 如果 stagger offset 为 0，使用原始方法
  if (stagger.offset === 0) {
    originalCreatePattern(paint, ui, canvas, renderOptions)
    return
  }

  let { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions)
  const id = `${scaleX}-${scaleY}-stagger-${stagger.type}-${stagger.offset}`

  if (paint.patternId !== id && !ui.destroyed) {
    const { image, data } = paint
    const { transform, gap } = data
    const fixScale = PaintImage.getPatternFixScale(paint, scaleX, scaleY)

    let imageMatrix: IMatrixData
    let xGap = 0
    let yGap = 0
    let { width, height } = image

    if (fixScale) {
      scaleX *= fixScale
      scaleY *= fixScale
    }

    width *= scaleX
    height *= scaleY

    // 平铺间距
    if (gap) {
      xGap = gap.x * scaleX / abs(data.scaleX || 1)
      yGap = gap.y * scaleY / abs(data.scaleY || 1)
    }

    // 单元格尺寸（图片 + 间距）
    const unitWidth = width + xGap
    const unitHeight = height + yGap

    const isXStagger = stagger.type === 'x'

    // pattern 尺寸（交错时需要翻倍）
    // X 方向交错：高度翻倍
    // Y 方向交错：宽度翻倍
    const patternWidth = isXStagger ? unitWidth : unitWidth * 2
    const patternHeight = isXStagger ? unitHeight * 2 : unitHeight

    if (transform || scaleX !== 1 || scaleY !== 1) {
      // 使用 pattern 的实际尺寸计算缩放矩阵
      const matrixScaleX = scaleX * getFloorScale(patternWidth)
      const matrixScaleY = scaleY * getFloorScale(patternHeight)

      imageMatrix = get()
      if (transform)
        copy(imageMatrix, transform)
      scale(imageMatrix, 1 / matrixScaleX, 1 / matrixScaleY)
    }

    // 创建带交错的 canvas
    const imageCanvas = createStaggerCanvas(
      image,
      width,
      height,
      xGap,
      yGap,
      stagger,
      data.opacity,
      ui.leafer?.config.smooth,
    )

    const pattern = image.getPattern(
      imageCanvas,
      data.repeat || 'repeat',
      imageMatrix,
      paint,
    )

    paint.style = pattern
    paint.patternId = id
  }
}

/** 安装 stagger 支持 */
export function installStaggerPattern(): void {
  PaintImage.createPattern = createPatternWithStagger
}

/** 处理 stagger 数据（在 paint 数据处理阶段调用） */
export function processStaggerData(paint: any): INormalizedStagger | null {
  if (paint.stagger !== undefined) {
    return normalizeStagger(paint.stagger)
  }
  return null
}

export { normalizeStagger }
