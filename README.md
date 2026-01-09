# leafer-x-watermark

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Leafer UI 水印插件，支持任意 LeaferJS 元素平铺水印

> ⚠️ **重要提示**：如果需要使用 `tileStagger`（错位排列）功能，必须在 `new App()` 后立即调用 `installStaggerPattern()` 进行补丁安装（此为临时方案，待官方支持后将移除）。

## ✨ 特性

- 🎨 **任意图形** - 支持任意 LeaferJS 元素作为水印内容
- 🔄 **平铺模式** - 支持平铺（repeat）和拉伸（stretch）两种模式
- 📐 **灵活缩放** - 支持自定义水印尺寸比例
- 🔲 **间距控制** - 支持自定义水印间距
- 🎯 **错位排列** - 支持水印错位（stagger）效果
- 🔃 **旋转支持** - 支持水印旋转角度设置
- ⚡ **性能优化** - 智能缓存，仅在必要时重新生成图片
- 🚀 **多版本支持** - 提供同步、异步及 URL 三种版本，适配不同场景需求

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

### 版本选择

根据水印内容选择合适的版本：

- **WatermarkSync（同步版本）** - 适用于纯文本、矩形等基础图形，性能更好
- **WatermarkAsync（异步版本）** - 适用于包含图片URL、自定义字体等需要加载的异步资源
- **WatermarkURL（URL版本）** - 直接通过图片URL创建水印，更加便捷

```typescript
import { WatermarkSync } from 'leafer-x-watermark'    // 同步版本
import { WatermarkAsync } from 'leafer-x-watermark'   // 异步版本
import { WatermarkURL } from 'leafer-x-watermark'     // URL版本
```

### 基础使用（同步版本）

```typescript
import { App } from 'leafer-ui'
import { WatermarkSync, installStaggerPattern } from 'leafer-x-watermark'

const app = new App({ view: 'app' })
installStaggerPattern() // 全局安装一次即可

const watermark = new WatermarkSync({
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

### URL版本使用

可以直接使用图片 URL 作为水印内容：

```typescript
import { App } from 'leafer-ui'
import { WatermarkURL, installStaggerPattern } from 'leafer-x-watermark'

const app = new App({ view: 'app' })
installStaggerPattern()

const watermark = new WatermarkURL({
  tileURL: 'https://example.com/logo.png',
  tileMode: true,
  tileSize: 50,
  width: 800,
  height: 600,
})

app.tree.add(watermark)
```

### 异步版本使用

当水印内容包含图片资源时，使用异步版本：

```typescript
import { App } from 'leafer-ui'
import { WatermarkAsync, installStaggerPattern } from 'leafer-x-watermark'

const app = new App({ view: 'app' })
installStaggerPattern()

const watermark = new WatermarkAsync({
  tileContent: JSON.stringify({
    tag: 'Image',
    url: 'https://example.com/logo.png',
    width: 100,
    height: 100,
  }),
  tileMode: true,
  width: 800,
  height: 600,
})

app.tree.add(watermark)
```

## 📖 API 文档

### WatermarkSync / WatermarkAsync / WatermarkURL

三个版本的 API 基本相同，主要区别：
- **WatermarkSync**: 同步生成，适用于纯图形。
- **WatermarkAsync**: 异步生成，适用于包含外部资源的图形。
- **WatermarkURL**: 直接使用 `tileURL` 属性设置图片 URL。

继承自 Leafer UI 的 [Rect](https://www.leaferjs.com/ui/display/Rect.html) 组件，拥有所有 Rect 属性，并额外支持：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tileContent` | string | - | 水印内容，LeaferJS 元素的 JSON 字符串（URL版本不支持） |
| `tileURL` | string | - | 直接设置图片 URL 作为水印（仅限 URL版本） |
| `tileMode` | boolean | `true` | 平铺模式：`true` 平铺，`false` 拉伸 |
| `tileSize` | number | `100` | 显示比例（%），100 为原始大小 |
| `tileGap` | `number \| { x?: number, y?: number }` | `0` | 间距比例（%），支持统一数值或分别设置 x/y 间距 |
| `tileStagger` | `number \| { type?: 'x' \| 'y', offset: number }` | `0` | 错位偏移，支持数值(0-100)或详细配置 |
| `tileRotation` | number | `0` | 水印旋转角度（度） |

### 属性说明

#### tileContent / tileURL

水印内容支持 LeaferJS 元素的 JSON 字符串（Sync/Async版本）或直接图片 URL（URL版本）：

```typescript
// Sync / Async 版本使用 tileContent
JSON.stringify({ tag: 'Text', text: '水印', fill: '#000', fontSize: 16 })

// URL 版本使用 tileURL
const tileURL = 'https://example.com/logo.png'
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

⚠️ **注意**：使用 `tileStagger` 功能前必须先调用 `installStaggerPattern()`

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
