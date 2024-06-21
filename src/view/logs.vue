<template>
  <n-layout position="absolute" style="height: 100%">
    <n-layout-header style="height: 64px; background-color: transparent">
      <n-card size="small">
        <n-button secondary strong @click="null">
          保存
          <template #icon>
            <n-icon>
              <SaveOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-button secondary strong style="margin-left: 10px" @click="null">
          清空
          <template #icon>
            <n-icon>
              <TrashOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-select v-model:value="source" :options="logsOptions" placeholder="选择日志源"
                  style="width: 180px; float: right;"/>
      </n-card>
    </n-layout-header>

    <n-layout ref="contentRef" :native-scrollbar="false" position="absolute" style="top: 72px;">
      <n-log ref="logInst" :log="logs[source]" language="naive-log"
             style="user-select: text; font-family: -apple-system; height: 100%;" word-wrap/>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {SaveOutline, TrashOutline} from "@vicons/ionicons5";
import {nextTick, ref, watch} from "vue";
import {LayoutInst, NIcon} from 'naive-ui'
import {storeToRefs} from "pinia";
import {useLogs} from "../store/logs.ts";
import {useProcess} from "../store/process.ts";

const contentRef: any = ref<LayoutInst | null>(null)
const {process} = storeToRefs(useProcess())
const {logs} = storeToRefs(useLogs())
const source: any = ref("all")

const _process = Object.keys(process.value);
const _logs = Object.keys(logs.value);

const logsOptions = ref([])

// for (let i = 0; i < Math.min(_process.length, _logs.length); i++) {
//   logsOptions.push({ label: _process[i], value: _logs[i] });
// }

console.log(_process)
console.log(_logs)

watch(() => logs.value[source], () => {
  nextTick(() => {
    console.log(contentRef.value.scrollHeight);
    contentRef.value.scrollTo({top: 9999999999999, behavior: 'smooth'});
  });
});
</script>