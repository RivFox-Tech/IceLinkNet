<template>
  <n-flex vertical>
    <span style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">个性化</span>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: -5px; margin-top: -4px">主题</p>
      </template>
      <template #header-extra>
        <n-select style="width: 180px;" :options="[
          { label: '浅色', value: 'light' },
          { label: '深色', value: 'dark' },
        ]" placeholder="主题色" @update:value="theme_switching"/>
      </template>
    </n-card>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: -5px; margin-top: -4px">配色</p>
      </template>
      <template #header-extra>
        <n-button>修改</n-button>
      </template>
    </n-card>
    <span style="font-size: 18px; font-weight: bold; margin-top: 8px; margin-bottom: 5px;">通用</span>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: -5px; margin-top: -3px">通知</p>
      </template>
      <template #header-extra>
        <n-select style="width: 180px;" :options="[
          { label: '应用与系统', value: '0' },
          { label: '仅应用', value: '1' },
          { label: '仅系统', value: '2' },
          { label: '关闭通知', value: '3' },
        ]" placeholder="主题色" @update:value="theme_switching"/>
      </template>
    </n-card>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: -5px; margin-top: -3px">托盘</p>
      </template>
      <template #header-extra>
        <n-select style="width: 180px;" :options="[
          { label: '应用与系统', value: '0' },
          { label: '仅应用', value: '1' },
          { label: '仅系统', value: '2' },
          { label: '关闭通知', value: '3' },
        ]" placeholder="主题色" @update:value="theme_switching"/>
      </template>
    </n-card>
    <span v-show="false" style="font-size: 18px; font-weight: bold; margin-top: 8px; margin-bottom: 5px;">高级</span>
    <n-card v-show="false" size="small">
      <template #header>
        <p style="margin-bottom: -3px; margin-top: 4px">API服务器</p>
      </template>
      <template #header-extra>
        <n-button style="margin-top: 8px; margin-right: 10px;" text>
          <template #icon>
            <n-icon>
              <SettingsOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-switch style="margin-top: 7px"/>
      </template>
    </n-card>
    <span style="font-size: 18px; font-weight: bold; margin-top: 8px; margin-bottom: 5px;">关于</span>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: -3px; margin-top: 3px">MoonNetwork</p>
      </template>
      <template #header-extra>
        <span style="margin-top: 6px;">1.0.0</span>
      </template>
    </n-card>
    <n-card size="small">
      <template #header>
        <p style="margin-bottom: 4px; margin-top: 5px">开源软件使用</p>
      </template>
      <template #header-extra>
        <n-button>瞅瞅</n-button>
      </template>
    </n-card>
  </n-flex>
</template>

<script setup lang="ts">
import {
  SettingsOutline
} from "@vicons/ionicons5";

function theme_switching(value: string) {
  PubSub.publish("theme", value);
}
</script>

<style scoped>
.n-card {
  height: 60px;
}

top5 {
  margin-top: 15px;
}
</style>