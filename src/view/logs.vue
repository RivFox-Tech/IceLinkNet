<template>
  <n-layout style="height: 100%; " position="absolute">
    <n-layout-header style="height: 64px; background-color: transparent;">
      <n-card size="small">
        <n-button @click="log" secondary strong>
          保存
          <template #icon>
            <n-icon>
              <SaveOutline />
            </n-icon>
          </template>
        </n-button>
        <n-select disabled style="width: 180px; float: right;" placeholder="选择日志源"/>
      </n-card>
    </n-layout-header>
    <n-layout ref="contentRef" :native-scrollbar="false" position="absolute" style="top: 70px;">
      <n-log language="naive-log" word-wrap style="user-select: text; font-family: -apple-system; height: 100%;" :log="logs['213']" ref="logInst"/>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import {SaveOutline} from "@vicons/ionicons5";
import child_process from "node:child_process";
import {ref} from "vue";
import {LayoutInst, NIcon} from 'naive-ui'
import {storeToRefs} from "pinia";
import {useLogs} from "../store/logs.ts";

const contentRef = ref<LayoutInst | null>(null)
const { logs } = storeToRefs(useLogs())

function formatLogMessage(message: any) {
  // Convert Buffer to string and handle newlines
  message = message.toString();
  return message.split('\n').map((line: any) => {
    if (line.includes("[I]")) {
      return `<span style="color: cornflowerblue">${line}</span>`;
    } else if (line.includes("[W]")) {
      return `<span style="color: orange">${line}</span>`;
    } else if (line.includes("[E]")) {
      return `<span style="color: indianred">${line}</span>`;
    }
    return line;
  }).join('\n');
}

function log() {
  const options: child_process.SpawnOptions = {
    windowsHide: true, // 隐藏窗口
    stdio: 'pipe', // 获取标准输出流
    detached: false, // 不允许后台运行
    windowsVerbatimArguments: true,
  };
  const args = [
    'tcp',
    '-s',
    '101.43.125.217',
    '-i',
    '127.0.0.1',
    '-l',
    '25565',
    '-r',
    '10012',
    '-n',
    'awa',
    '--disable-log-color'
  ];
  const exeProcess = child_process.spawn("D:\\env\\frp\\frpc.exe", args, options);
  exeProcess.stdout?.on('data', (data) => {
    setTimeout(() => {
      logs.value["213"] += (formatLogMessage(data));
      setTimeout(() => contentRef.value?.scrollTo({ top: 999999999999999, behavior: 'smooth' }), 100);
    }, 250);
  });
  exeProcess.stderr?.on('data', (data) => {
    setTimeout(() => {
      logs.value["213"] += (formatLogMessage(data));
      setTimeout(() => contentRef.value?.scrollTo({ top: 999999999999999, behavior: 'smooth' }), 100);
    }, 250);
  });
}
</script>