<template>
  <n-flex vertical>
    <n-card title="呃呃呃">
      目前不知道放什么 <br>
      账号, 扩展 貌似还需要1-4个版本更新
    </n-card>
    
    <n-button @click="awa">123</n-button>
    <!--cornflowerblue orange indianred-->
  </n-flex>
</template>

<script setup lang="ts">
import {ref} from "vue";
import * as child_process from "node:child_process";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

function awa() {
  console.log(__dirname)
}
</script>