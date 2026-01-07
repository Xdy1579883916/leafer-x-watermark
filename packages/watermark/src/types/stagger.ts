/** 交错方向 */
export type IStaggerType = 'x' | 'y'

/** 交错配置对象 */
export interface IStaggerData {
  /** 交错方向，默认 'x' */
  type?: IStaggerType
  /** 交错偏移百分比 0~100 */
  offset: number
}

/** 交错配置，支持 number(0~100) 或 { type?, offset } */
export type IStagger = number | IStaggerData

/** 标准化后的交错数据 */
export interface INormalizedStagger {
  type: IStaggerType
  offset: number
}

declare module '@leafer-ui/interface' {
  interface IImagePaint {
    /** 交错排版配置，支持 number(0~100) 或 { type?: 'x' | 'y', offset: number } */
    stagger?: IStagger
  }
}
