// 导出共享类型
export type { IProcessDataType, ITileGap, IWatermark, IWatermarkAttrData, IWatermarkInputData } from './lib/base/types'
// 异步版本（适用于包含网络图片URL等异步资源）
export { WatermarkAsync } from './lib/WatemarkAsync'
// 同步版本（默认，适用于纯文本/图形水印）
export { WatermarkSync } from './lib/WatermarkSync'
// URL版本（直接设置图片URL）
export { WatermarkURL } from './lib/WatermarkURL'
// 导出工具函数
export { installStaggerPattern, normalizeStagger, processStaggerData } from './stagger'
export * from './types/stagger'
