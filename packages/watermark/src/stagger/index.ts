import type { ILeaferCanvas, ILeafPaint, IMatrixData, IRenderOptions, IUI } from '@leafer-ui/interface'
import type { INormalizedStagger, IStagger } from '../types/stagger'
import { MathHelper, MatrixHelper, PaintImage, Platform } from '@leafer-ui/core'

const { get, scale, copy } = MatrixHelper
const { getFloorScale } = MathHelper
const { abs } = Math

const ORIGINAL_CREATE_PATTERN = Symbol.for('leafer-x-watermark:PaintImage.createPattern.original')
const STAGGER_PATTERN_ID = Symbol.for('leafer-x-watermark:paint.staggerPatternId')

type CreatePatternFn = typeof PaintImage.createPattern

function ensureOriginalCreatePattern(): CreatePatternFn {
  const anyPaintImage = PaintImage as any
  if (!anyPaintImage[ORIGINAL_CREATE_PATTERN]) {
    anyPaintImage[ORIGINAL_CREATE_PATTERN] = PaintImage.createPattern.bind(PaintImage)
  }
  return anyPaintImage[ORIGINAL_CREATE_PATTERN] as CreatePatternFn
}

interface StaggerCanvasCacheEntry {
  params: [
    width: number,
    height: number,
    xGap: number,
    yGap: number,
    staggerType: INormalizedStagger['type'],
    staggerOffset: number,
    opacity?: number,
    smooth?: boolean,
  ]
  canvas: HTMLCanvasElement
}

const staggerCanvasCache = new WeakMap<any, StaggerCanvasCacheEntry>()

/** 标准化 stagger 参数 */
function normalizeStagger(stagger: IStagger): INormalizedStagger {
  if (typeof stagger === 'number') {
    return { type: 'x', offset: stagger }
  }
  return { type: stagger.type || 'x', offset: stagger.offset || 0 }
}

function isSameStaggerParams(a: StaggerCanvasCacheEntry['params'], b: StaggerCanvasCacheEntry['params']): boolean {
  return (
    a[0] === b[0]
    && a[1] === b[1]
    && a[2] === b[2]
    && a[3] === b[3]
    && a[4] === b[4]
    && a[5] === b[5]
    && a[6] === b[6]
    && a[7] === b[7]
  )
}

/**
 * 获取缓存的 stagger canvas（模仿 image.getCanvas 的缓存机制）
 */
function getStaggerCanvas(
  image: any,
  width: number,
  height: number,
  xGap: number,
  yGap: number,
  stagger: INormalizedStagger,
  opacity?: number,
  smooth?: boolean,
): HTMLCanvasElement {
  const cached = staggerCanvasCache.get(image)
  if (cached) {
    const nextParams: StaggerCanvasCacheEntry['params'] = [
      width,
      height,
      xGap,
      yGap,
      stagger.type,
      stagger.offset,
      opacity,
      smooth,
    ]
    if (isSameStaggerParams(cached.params, nextParams))
      return cached.canvas
  }

  const canvas = createStaggerCanvas(image, width, height, xGap, yGap, stagger, opacity, smooth)

  staggerCanvasCache.set(image, {
    params: [width, height, xGap, yGap, stagger.type, stagger.offset, opacity, smooth],
    canvas,
  })

  return canvas
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
  const unitWidth = imgWidth + xGap
  const unitHeight = imgHeight + yGap

  const isXStagger = stagger.type === 'x'
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
  const drawImg = (x: number, y: number) => {
    ctx.drawImage(imgView, 0, 0, image.width, image.height, x, y, imgWidth, imgHeight)
  }

  const offset = (stagger.offset / 100) * (isXStagger ? unitWidth : unitHeight)

  if (isXStagger) {
    drawImg(0, 0)
    drawImg(offset, unitHeight)
    if (offset + imgWidth > unitWidth) {
      drawImg(offset - unitWidth, unitHeight)
    }
  }
  else {
    drawImg(0, 0)
    drawImg(unitWidth, offset)
    if (offset + imgHeight > unitHeight) {
      drawImg(unitWidth, offset - unitHeight)
    }
  }

  return canvas
}

/**
 * 带交错支持的 createPattern
 * 完全参考官方 createPattern 的结构重写
 */
function createPatternWithStagger(
  paint: ILeafPaint,
  ui: IUI,
  canvas: ILeaferCanvas,
  renderOptions: IRenderOptions,
): void {
  const originalCreatePattern = ensureOriginalCreatePattern()
  const rawStagger = (paint.data as any)?.stagger ?? (paint.originPaint as any)?.stagger

  if (rawStagger === undefined || rawStagger === 0) {
    originalCreatePattern(paint, ui, canvas, renderOptions)
    return
  }

  const stagger = normalizeStagger(rawStagger)

  if (stagger.offset === 0) {
    originalCreatePattern(paint, ui, canvas, renderOptions)
    return
  }

  let { scaleX, scaleY } = PaintImage.getImageRenderScaleData(paint, ui, canvas, renderOptions)
  const baseId = `${scaleX}-${scaleY}`
  const staggerId = `${baseId}-stagger-${stagger.type}-${stagger.offset}`

  const anyPaint = paint as any
  if (ui.destroyed)
    return
  if (paint.patternId === baseId && anyPaint[STAGGER_PATTERN_ID] === staggerId)
    return
  if (Platform.image.isLarge(paint.image, scaleX, scaleY) && !paint.data.repeat)
    return

  const { image, data } = paint
  const { transform, gap } = data
  const fixScale = PaintImage.getPatternFixScale(paint, scaleX, scaleY)

  if (fixScale) {
    scaleX *= fixScale
    scaleY *= fixScale
  }

  let imageMatrix: IMatrixData
  let xGap = 0
  let yGap = 0
  let { width, height } = image

  width *= scaleX
  height *= scaleY

  if (gap) {
    xGap = gap.x * scaleX / abs(data.scaleX || 1)
    yGap = gap.y * scaleY / abs(data.scaleY || 1)
  }

  if (transform || scaleX !== 1 || scaleY !== 1) {
    scaleX *= getFloorScale(width + (xGap || 0))
    scaleY *= getFloorScale(height + (yGap || 0))

    imageMatrix = get()
    if (transform)
      copy(imageMatrix, transform)
    scale(imageMatrix, 1 / scaleX, 1 / scaleY)
  }

  const imageCanvas = getStaggerCanvas(
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
    data.repeat || (Platform.origin.noRepeat || 'no-repeat'),
    imageMatrix,
    paint,
  )

  paint.style = pattern
  paint.patternId = baseId
  anyPaint[STAGGER_PATTERN_ID] = staggerId
}

/** 安装 stagger 支持 */
export function installStaggerPattern(): void {
  ensureOriginalCreatePattern()
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
