# leafer-x-watermark

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Leafer UI 水印插件，支持任意 LeaferJS 元素平铺水印

## ✨ 特性

- 🎨 **任意图形** - 支持任意 LeaferJS 元素作为水印内容
- 🔄 **平铺模式** - 支持平铺（repeat）和拉伸（stretch）两种模式
- 📐 **灵活缩放** - 支持自定义水印尺寸比例
- 🔲 **间距控制** - 支持自定义水印间距
- 🎯 **错位排列** - 支持水印错位（stagger）效果
- 🔃 **旋转支持** - 支持水印旋转角度设置
- ⚡ **性能优化** - 智能缓存，仅在必要时重新生成图片

## 📦 安装

```bash
# pnpm
pnpm add leafer-x-watermark

# npm
npm install leafer-x-watermark

# yarn
yarn add leafer-x-watermark
```

## 🚀 快速开始

### 基础使用

```typescript
import { App } from 'leafer-ui'
import { Watermark } from 'leafer-x-watermark'

const app = new App({ view: 'app' })

const watermark = new Watermark({
  tileContent: JSON.stringify({
    tag: 'Text',
    text: '水印文字',
    fill: 'rgba(0, 0, 0, 0.1)',
    fontSize: 16,
  }),
  width: 800,
  height: 600,
})

app.tree.add(watermark)
```

### 平铺模式

```typescript
const watermark = new Watermark({
  tileContent: JSON.stringify({
    tag: 'Text',
    text: 'CONFIDENTIAL',
    fill: 'rgba(255, 0, 0, 0.1)',
    fontSize: 20,
  }),
  tileMode: true, // 开启平铺
  tileSize: 100, // 100% 原始大小
  tileGap: 20, // 20% 间距
  tileRotation: -30, // 旋转 -30 度
  width: 800,
  height: 600,
})
```

### 错位排列

```typescript
const watermark = new Watermark({
  tileContent: JSON.stringify({
    tag: 'Text',
    text: '机密文件',
    fill: 'rgba(0, 0, 0, 0.1)',
    fontSize: 14,
  }),
  tileMode: true,
  tileStagger: 50, // 50% 错位偏移
  tileGap: 10,
  width: 800,
  height: 600,
})
```

### 图形水印

```typescript
const watermark = new Watermark({
  tileContent: JSON.stringify({
    tag: 'Group',
    children: [
      { tag: 'Ellipse', width: 20, height: 20, fill: 'rgba(0, 100, 255, 0.2)' },
      { tag: 'Text', text: 'LOGO', x: 25, y: 3, fill: 'rgba(0, 100, 255, 0.2)', fontSize: 12 },
    ],
  }),
  tileMode: true,
  tileSize: 80,
  tileGap: 30,
  width: 800,
  height: 600,
})
```

## 📖 API 文档

### Watermark 属性

继承自 Leafer UI 的 [Rect](https://www.leaferjs.com/ui/display/Rect.html) 组件，拥有所有 Rect 属性，并额外支持：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tileContent` | string | - | 水印内容，LeaferJS 元素的 JSON 字符串 |
| `tileMode` | boolean | `true` | 平铺模式：`true` 平铺，`false` 拉伸 |
| `tileSize` | number | `100` | 显示比例（%），100 为原始大小 |
| `tileGap` | `number \| { x?: number, y?: number }` | `0` | 间距比例（%），支持统一数值或分别设置 x/y 间距 |
| `tileStagger` | `number \| { type?: 'x' \| 'y', offset: number }` | `0` | 错位偏移，支持数值(0-100)或详细配置 |
| `tileRotation` | number | `0` | 水印旋转角度（度） |

### 属性说明

#### tileContent

水印内容为 LeaferJS 元素的 JSON 字符串，支持所有 LeaferJS 图形类型：

```typescript
// 文本
JSON.stringify({ tag: 'Text', text: '水印', fill: '#000', fontSize: 16 })

// 图片
JSON.stringify({ tag: 'Image', url: 'logo.png', width: 50, height: 50 })

// 组合图形
JSON.stringify({
  tag: 'Group',
  children: [
    { tag: 'Rect', width: 30, height: 30, fill: '#f00' },
    { tag: 'Text', text: 'A', x: 10, y: 5, fill: '#fff' },
  ],
})
```

#### tileSize

控制水印显示大小的比例：
- `100` = 原始大小
- `50` = 缩小 50%
- `200` = 放大 200%
- `0` 或负数 = 不显示水印

#### tileGap

间距基于显示尺寸的百分比计算：
- `tileGap: 10` 表示间距为水印宽/高的 10%
- 支持分别设置：`{ x: 20, y: 10 }`

#### tileStagger

错位排列效果，支持数值 (0-100) 或对象配置：
- `tileStagger: 50` = 水平方向（x）相邻行偏移 50%
- `{ type: 'y', offset: 50 }` = 垂直方向（y）相邻列偏移 50%
- `0` = 无错位
- `100` = 完全错位（等于一个完整水印尺寸）

## 💡 使用场景

- 📄 文档版权保护
- 🖼️ 图片水印
- 🔒 机密文件标识
- 🏢 企业 Logo 背景
- 📑 证书防伪

## 🔗 相关链接

- [在线演示](https://leafer-x-watermark.vercel.app/)
- [Leafer UI 文档](https://www.leaferjs.com/ui/guide/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## License

[MIT](./LICENSE) License © 2024-PRESENT [XiaDeYu](https://github.com/Xdy1579883916)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/leafer-x-watermark?style=flat&colorA=080f12&colorB=1fa669

[npm-version-href]: https://npmjs.com/package/leafer-x-watermark

[npm-downloads-src]: https://img.shields.io/npm/dm/leafer-x-watermark?style=flat&colorA=080f12&colorB=1fa669

[npm-downloads-href]: https://npmjs.com/package/leafer-x-watermark

[bundle-src]: https://img.shields.io/bundlephobia/minzip/leafer-x-watermark?style=flat&colorA=080f12&colorB=1fa669&label=minzip

[bundle-href]: https://bundlephobia.com/result?p=leafer-x-watermark

[license-src]: https://img.shields.io/github/license/Xdy1579883916/leafer-x-watermark.svg?style=flat&colorA=080f12&colorB=1fa669

[license-href]: https://github.com/Xdy1579883916/leafer-x-watermark/blob/master/LICENSE
