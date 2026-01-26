# leafer-x-watermark

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Leafer UI 水印插件，基于 Leafer 2.0.0 构建，使用更加简单高效。

## ✨ 特性

- 🖼️ **图片水印** - 直接使用图片 URL 创建水印
- 🔄 **平铺模式** - 支持平铺（repeat）和拉伸（stretch）两种模式
- 📐 **灵活缩放** - 支持自定义水印尺寸比例
- 🔲 **间距控制** - 支持自定义水印间距
- 🎯 **错位排列** - 支持水印错位效果：基于 Leafer 2.0.0版本（interlace）支持
- 🔃 **旋转支持** - 支持水印旋转角度设置

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

```typescript
import { App } from 'leafer-ui'
import { WatermarkURL } from 'leafer-x-watermark'

const app = new App({ view: 'app' })

const watermark = new WatermarkURL({
  tileURL: 'https://leaferjs.com/image/logo.svg',
  tileMode: true,
  tileSize: 50, // 缩放 50%
  tileGap: 20, // 间距 20%
  tileStagger: 50, // 错位 50%
  width: 800,
  height: 600,
})

app.tree.add(watermark)
```

## 📖 API 文档

### WatermarkURL

继承自 Leafer UI 的 [Rect](https://www.leaferjs.com/ui/reference/display/Rect.html) 组件，拥有所有 Rect 属性。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tileURL` | string | - | 水印图片的 URL 地址 |
| `tileMode` | boolean | `true` | 平铺模式：`true` 平铺，`false` 拉伸 |
| `tileSize` | number | `100` | 显示比例（%），100 为原始大小 |
| `tileGap` | `number \| { x?: number, y?: number }` | `0` | 间距比例（%），支持统一数值或分别设置 x/y 间距 |
| `tileStagger` | `number \| { type?: 'x' \| 'y', offset: number }` | `0` | 错位偏移，支持数值(0-100)或详细配置 |
| `tileRotation` | number | `0` | 水印旋转角度（度） |

### 属性说明

#### tileURL

设置水印图片的地址，支持网络图片 URL 或 Base64 字符串。

```typescript
// 使用网络图片
watermark.tileURL = 'https://example.com/logo.png'
```

#### tileSize

控制水印显示大小的比例：
- `100` = 原始大小
- `50` = 缩小 50%
- `200` = 放大 200%
- `0` = 不显示

#### tileGap

间距基于显示尺寸的百分比计算：
- `tileGap: 10` 表示间距为水印宽/高的 10%
- 支持分别设置：`{ x: 20, y: 10 }`

#### tileStagger

错位排列效果（Interlace），支持数值 (0-100) 或对象配置：
- `tileStagger: 50` = 水平方向（x）相邻行偏移 50%
- `{ type: 'y', offset: 50 }` = 垂直方向（y）相邻列偏移 50%
- `0` = 无错位

#### tileMode

- `true`: 启用平铺模式（Repeat），支持间距、错位等效果。
- `false`: 启用拉伸模式（Stretch），图片将填满整个区域。

## 💡 使用场景

- 📄 文档版权保护
- 🖼️ 图片水印
- 🔒 机密文件标识
- 🏢 企业 Logo 背景

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
