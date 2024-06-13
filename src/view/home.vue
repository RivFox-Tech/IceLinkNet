<template>
  <n-flex vertical>
    <n-card title="呃呃呃">
      目前不知道放什么 <br>
      账号, 扩展 貌似还需要1-4个版本更新
    </n-card>

    <n-modal :show="downloadFrpc">
      <n-card
          style="width: 400px;"
          title="安装 Frpc"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true">
        <n-progress type="line" :percentage="downloadFrpcProgress" :show-indicator="false" />
      </n-card>
    </n-modal>
    
    <p>{{awas}}</p>
  </n-flex>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {ipcRenderer} from "electron";
import system from "../services/system.ts";
import path from "node:path";
import fs from "node:fs";
import {useMessage} from "naive-ui";
import {storeToRefs} from "pinia";
import {useProcess} from "../store/process.ts";

const awas = ref("");
const downloadFrpc = ref(false);
const downloadFrpcProgress = ref(0);
let frpcName: string;

initialFrpc();
function initialFrpc() {
  if (system() === "windows") frpcName = "frpc.exe";
  else frpcName = "frpc";
  const folderPath = path.join(process.cwd(), `core/${frpcName}`);
  if (!fs.existsSync(folderPath)) {
    const message = useMessage();
    downloadFrpc.value = true;
    ipcRenderer.on("downloadProgress", (event, value) => {
      downloadFrpcProgress.value = value;
    });
    ipcRenderer.invoke("downloadFile", `https://depot.rivfox.com/public/moonnetwork/${frpcName}`, folderPath)
        .then(filePath => {
          message.success("下载完成");
          downloadFrpc.value = false;
        })
        .catch(error => {
          message.error("失败" + error);
        });
  }
}

function awa() {
  const { process } = storeToRefs(useProcess());
  const processStore = useProcess();

  processStore.addProcess("", "")
}
</script>