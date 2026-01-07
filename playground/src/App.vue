<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import '@leafer-in/editor'
import '@leafer-in/export'
import '@leafer-in/view'
import '@leafer-in/viewport'
import {App, Debug, Group} from "leafer-ui";
import "@lx/watermark"
import './util/proxyData'

import { Watermark } from  "@lx/watermark"

let leaferApp: App
Debug.filter = ['leafer-x-watermark']
Debug.enable = true
// console.log(UICreator.list);
let target: Watermark = null
const inited = ref(false)

async function initLeafer() {

  leaferApp = new App({
    view: 'leafer-app',
    width: 1200,
    height: 600,
    editor: {
      editSize: 'size',
      point: {
        editConfig: {editSize: 'font-size'},
      }
    },
  })
  const watermark = {
    tileContent: JSON.stringify({
      "tag": "Group",
      "editable": true,
      "hitChildren": false,
      "children": [
        {
          "tag": "Ellipse",
          "id": "upxZDV6yFea4sqv6zyvEuJQAIsI5MSJp",
          "x": 4.831637088269847e-14,
          "y": 0,
          "width": 236.05846442470025,
          "height": 236.05846442470025,
          "scaleX": 1,
          "scaleY": 1,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "fill": [
            {
              "type": "solid",
              "color": "rgba(255, 255, 255, 0)"
            }
          ],
          "stroke": [
            {
              "type": "solid",
              "color": "#000"
            }
          ],
          "strokeWidth": 6,
          "data": {}
        },
        {
          "tag": "Text",
          "width": 208.47581660890552,
          "height": 52.11895415222638,
          "fill": [
            {
              "type": "solid",
              "color": "#000"
            }
          ],
          "text": "大灰狼の店铺",
          "fontSize": 30.294142100981514,
          "fontWeight": "bold",
          "lineHeight": {
            "type": "percent",
            "value": 1.5
          },
          "textAlign": "center",
          "verticalAlign": "middle",
          "id": "ufxOsol7iyEFpS2tz6nMRK6chdohdtae",
          "x": 13.490164423620513,
          "y": 65.91027806012366,
          "scaleX": 1.0000000000000002,
          "scaleY": 1.0000000000000002,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "data": {}
        },
        {
          "tag": "Text",
          "width": 211.44234901041355,
          "height": 30.84348741807116,
          "fill": [
            {
              "type": "solid",
              "color": "#000"
            }
          ],
          "text": "电话:00000000000",
          "fontSize": 22.51806781770512,
          "lineHeight": {
            "type": "percent",
            "value": 1.5
          },
          "textAlign": "center",
          "verticalAlign": "middle",
          "id": "u8po79czIydtfeWsWah5JWtJEmuHi7qm",
          "x": 12.308057707143153,
          "y": 129.9043687312298,
          "scaleX": 1.0000000000000002,
          "scaleY": 1.0000000000000002,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "data": {}
        },
        {
          "tag": "Text",
          "width": 160.60629822826596,
          "height": 25.92425999120201,
          "fill": [
            {
              "type": "solid",
              "color": "#000"
            }
          ],
          "text": "盗图必究",
          "fontSize": 14.529701201285203,
          "lineHeight": {
            "type": "percent",
            "value": 1.5
          },
          "textAlign": "center",
          "verticalAlign": "middle",
          "id": "uy0LKuKDtLEKpKsUumF49GgV1hYTVml1",
          "x": 37.726083098217096,
          "y": 178.49939527642232,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "data": {}
        }
      ]
    }),
    width: 1200,
    height: 600,
    tileMode: true,
    tileRotation: 0,
    tileSize: 100,
    tileStagger: 0,
    tileGap: 0,
    editable: true,
  }
  const watermark1 = {
    tileContent: JSON.stringify({
      "tag": "Group",
      "editable": true,
      "hitChildren": false,
      "children": [
        {
          "tag": "Text",
          "width": 160.60629822826596,
          "height": 25.92425999120201,
          "fill": [
            {
              "type": "solid",
              "color": "#000"
            }
          ],
          "text": "盗图必究",
          "fontSize": 14.529701201285203,
          "lineHeight": {
            "type": "percent",
            "value": 1.5
          },
          "textAlign": "center",
          "verticalAlign": "middle",
          "id": "uy0LKuKDtLEKpKsUumF49GgV1hYTVml1",
          "x": 37.726083098217096,
          "y": 178.49939527642232,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "data": {}
        }
      ]
    }),
    width: 1200,
    height: 600,
    tileMode: true,
    tileRotation: 0,
    tileSize: 100,
    tileStagger: 0,
    tileGap: 0,
    editable: true,
  }
  target = new Watermark(watermark)
  inited.value = true
  leaferApp.tree.add(target)
  ;(window as any).app = leaferApp
}

onMounted(() => {
  initLeafer()
})

function handleExport() {
  leaferApp.tree.export("test.png")
}

function getUIs() {
  return leaferApp.tree.children
}

function handleExport2() {
  const group = new Group()
  const uis = getUIs()
  uis.forEach(v => {
    v.clone().dropTo(group)
  })
  group.export("test.png")
}


function handleExport3() {
  console.log(getUIs().map(v => v.toJSON()))
}
function handleDebug() {
  Debug.enable = !Debug.enable
  Debug.showBounds = Debug.enable ? 'hit' : false
}


const tileStaggerType = computed({
  get() {
    const stagger = target.proxyData.tileStagger
    return stagger?.type || 'x'
  },
  set(v) {
    target.tileStagger = {
      type: v,
      offset: tileStaggerOffset.value
    }
  }
})
const tileStaggerOffset = computed({
  get() {
    const offset = typeof target.tileStagger === 'number' ? target.tileStagger : target.tileStagger?.offset
    return offset || 0
  },
  set(v) {
    target.tileStagger = {
      type: tileStaggerType.value,
      offset: v
    }
  }
})
</script>

<template>
  <NFlex justify="start">
    <div id="leafer-app" style="background: rgb(242 235 255);"></div>
    <NFlex vertical>
      <h3>window.app 可获取leafer 实例, 自行操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出画布</NButton>
        <NButton @click="handleExport2">导出元素</NButton>
        <NButton @click="handleExport3">导出JSON（见console）</NButton>
      </NFlex>
      <NForm justify="start" v-if="inited">
        <NFormItem label="旋转">
          <n-slider v-model:value="target.proxyData.tileRotation" :step="1" :max="360" />
        </NFormItem>
        <NFormItem label="交错方向">
          <n-radio-group v-model:value="tileStaggerType">
            <n-radio value="x">横向</n-radio>
            <n-radio value="y">纵向</n-radio>
          </n-radio-group>
        </NFormItem>
        <NFormItem label="交错">
          <n-slider v-model:value="tileStaggerOffset" :step="1" :max="100" />
        </NFormItem>
        <NFormItem label="大小">
          <n-slider v-model:value="target.proxyData.tileSize" :step="1" :max="100" />
        </NFormItem>
        <NFormItem label="间距">
          <n-slider v-model:value="target.proxyData.tileGap" :step="1" :max="100" />
        </NFormItem>
      </NForm>
    </NFlex>
  </NFlex>
</template>
