<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue'
import '@leafer-in/editor'
import '@leafer-in/export'
import '@leafer-in/view'
import '@leafer-in/viewport'
import {App, Debug, Frame, Group} from "leafer-ui";
import "@lx/watermark"
import './util/proxyData'
import {WatermarkURL, WatermarkURL as Watermark} from "@lx/watermark"

let leaferApp: App
Debug.filter = ['leafer-x-watermark']
Debug.enable = true
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
  const frame = new Frame({
    width: 500,
    height: 500,
    x: 50,
    y: 50,
    fill: "#f40",
    editable: false,
  })
  const size = 400
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
  uis.push(w3)
  frame.add(w3)
  leaferApp.tree.add(frame)
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
            <n-slider v-model:value="target.proxyData.tileSize" :step="1" :max="200" />
          </NFormItem>
          <NFormItem label="间距">
            <n-slider v-model:value="target.proxyData.tileGap" :step="1" :max="100" />
          </NFormItem>
        </template>
      </NForm>
    </NFlex>
  </NFlex>
</template>
