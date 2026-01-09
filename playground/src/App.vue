<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue'
import '@leafer-in/editor'
import '@leafer-in/export'
import '@leafer-in/view'
import '@leafer-in/viewport'
import {App, Debug, Group} from "leafer-ui";
import "@lx/watermark"
import './util/proxyData'
import {installStaggerPattern, WatermarkURL, WatermarkURL as Watermark, WatermarkSync, WatermarkAsync} from "@lx/watermark"

let leaferApp: App
Debug.filter = ['leafer-x-watermark']
Debug.enable = true
// console.log(UICreator.list);
let target: Watermark = null
const uis: any = []
const targetIndex = ref(0)
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
  installStaggerPattern()
  const size = 400
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
        },
        {
          "tag": "Text",
          "width": 160.60629822826596,
          "height": 25.92425999120201,
          "fill": [
            {
              "type": "solid",
              "color": "#f40"
            }
          ],
          "text": "WatermarkSync",
          "fontSize": 14.529701201285203,
          "lineHeight": {
            "type": "percent",
            "value": 1.5
          },
          "textAlign": "center",
          "verticalAlign": "middle",
          "id": "uy0LKuKDtLEKpKsUumF49GgV1hYTVml1",
          "x": 37.726083098217096,
          "y": 158.49939527642232,
          "rotation": 0,
          "skewX": 0,
          "skewY": 0,
          "editable": true,
          "data": {}
        }
      ]
    }),
    width: size,
    height: size,
    tileMode: true,
    tileRotation: 0,
    tileSize: 30,
    tileStagger: 0,
    tileGap: 0,
    editable: true,
  }
  const w1 = new WatermarkSync(watermark)
  leaferApp.tree.add(w1)
  const watermark2 = {
    "tag": "Watermark",
    "tileContent": JSON.stringify({"tag":"Group","id":"bMObjJRg2Cev1OZA0lqE1q7zA25Z26RI","x":34.3495451070321,"y":13.654484559229843,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"lockRatio":true,"editable":true,"hitChildren":false,"data":{},"children":[{"tag":"Image","url":"https://cn.vuejs.org/logo.svg","id":"uUENq5uNerFNAJmdhCu14bJAVRw38gZW","x":0,"y":0,"width":228.83517587263196,"height":237.08148851669043,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"editable":true,"data":{}},{"tag":"Image","url":"https://cn.vuejs.org/logo.svg","id":"uI91P8PDhuYSAyETBq7jFv25rfpETi9s","x":0,"y":281.1208998246031,"width":228.83517587263196,"height":237.08148851669043,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"editable":true,"data":{}},{"tag":"Image","url":"https://cn.vuejs.org/logo.svg","id":"u9UA0VL03iB8pDdfNOH1pqrhiMvIfnqF","x":284.7250139249188,"y":281.1208998246031,"width":228.83517587263196,"height":237.08148851669043,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"editable":true,"data":{}},{"tag":"Image","url":"https://cn.vuejs.org/logo.svg","id":"uEDCx6UAhUTp0ktpQjEPXzPoFKhlY62f","x":284.7250139249188,"y":0,"width":228.83517587263196,"height":237.08148851669043,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"editable":true,"data":{}},{"tag":"Text","width":314,"height":48,"fill":[{"type":"solid","color":"rgba(255, 0, 0, 1)"}],"text":"WatermarkAsync","fontSize":32,"fontWeight":"bold","lineHeight":{"type":"percent","value":1.5},"textAlign":"center","verticalAlign":"middle","id":"uAwzADSqZWLkkrRzKkdYnAOOK6sOAM8b","x":127.72501392491881,"y":237.0814885166904,"scaleX":1,"scaleY":1,"rotation":0,"skewX":0,"skewY":0,"editable":true,"data":{}}]}),
    "tileMode": true,
    width: size,
    height: size,
    x: size,
    "tileSize": 30,
    "editable": true
  }
  const w2 = new WatermarkAsync(watermark2)
  leaferApp.tree.add(w2)
  const watermark3 = {
    tileURL: "https://cn.vuejs.org/logo.svg",
    width: size,
    height: size,
    x: size * 2,
    tileMode: true,
    tileRotation: 0,
    tileSize: 30,
    tileStagger: 0,
    tileGap: 0,
    editable: true,
  }
  const w3 = new WatermarkURL(watermark3)
  leaferApp.tree.add(w3)
  uis.push(w1, w2, w3)
  setActive()
  ;(window as any).app = leaferApp
}

function setActive() {
  nextTick(() => {
    target = uis[targetIndex.value] as Watermark
    inited.value = true
  })
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
    target = uis[targetIndex.value] as Watermark
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
    target = uis[targetIndex.value] as Watermark
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
    <div id="leafer-app" style="background: rgb(242 235 255);width: 1200px;height: 600px;"></div>
    <NFlex vertical>
      <h3>window.app 可获取leafer 实例, 自行操作</h3>
      <NFlex justify="start">
        <NButton @click="handleDebug"> Debug </NButton>
        <NButton @click="handleExport">导出画布</NButton>
        <NButton @click="handleExport2">导出元素</NButton>
        <NButton @click="handleExport3">导出JSON（见console）</NButton>
      </NFlex>
      <NForm justify="start" v-if="inited" :key="targetIndex">
        <NFormItem label="操作元素">
          <NRadioGroup v-model:value="targetIndex" @updateValue="setActive()">
            <NRadio v-for="(_,index) in uis" :key="index" :value="index">
              w{{ index +1 }}
            </NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="平铺">
          <NSwitch v-model:value="target.proxyData.tileMode"></NSwitch>
        </NFormItem>
        <template v-if="target.proxyData.tileMode">
          <NFormItem label="旋转">
            <n-slider v-model:value="target.proxyData.tileRotation" :step="1" :max="180" :min="-180" />
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
        </template>
      </NForm>
    </NFlex>
  </NFlex>
</template>
