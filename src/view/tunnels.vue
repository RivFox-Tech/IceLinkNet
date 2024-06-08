<template>
  <!--操作-->
  <n-layout style="height: 100%; " position="absolute">
    <n-layout-header style="height: 64px; background-color: transparent;">
      <n-card size="small">
        <div>
          <n-button :loading="loading" @click="getLocalTunnel" secondary strong>
            刷新
            <template #icon>
              <n-icon>
                <RefreshOutline/>
              </n-icon>
            </template>
          </n-button>
          <n-dropdown trigger="hover" :options="local.tunnel.options" @select="showLocalTunnelClick">
            <n-button style="margin-left: 10px" secondary strong>
              添加
              <template #icon>
                <n-icon>
                  <AddOutline/>
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
          <n-button disabled style="margin-left: 10px" secondary strong>
            云管理
            <template #icon>
              <n-icon>
                <CloudOutline/>
              </n-icon>
            </template>
          </n-button>
          <n-select disabled style="width: 180px; float: right;" placeholder="选择数据源"/>
        </div>
      </n-card>
    </n-layout-header>
    <n-layout ref="contentRef" :native-scrollbar="false" position="absolute" style="top: 64px;">
      <!--数据展示-->
      <n-list v-show="!loading" style="margin-top: 10px" hoverable clickable>
        <n-list-item
            v-for="(item) in local.tunnel.source"
            :key="item"
            @click="selectTunnel(item)">
          <div>
            {{ item.tunnelName }} <span style="opacity: 0.5">#{{ item.tunnelId }}</span>
            <n-tag type="success" size="small" style="float: right">NB666</n-tag>
          </div>
          <span style="opacity: 0.5">{{ item.tunnelType.toUpperCase() }} {{ item.localIp }}:{{ item.localPort }} == {{ item.remotePort }}</span>
        </n-list-item>
      </n-list>
      <!--Loading-->
      <n-spin :show="loading" style="margin-top: 23%; margin-left: 48%">
        <p v-show="false">114514</p>
      </n-spin>
    </n-layout>
  </n-layout>

  <!--隧道操作面板-->
  <n-drawer style="-webkit-app-region: no-drag;"
            v-model:show="tunnel.show"
            :width="520">
    <n-drawer-content closable title="操作隧道">
      <n-scrollbar>
        <n-grid x-gap="12" :cols="2">
          <n-gi>
            <n-descriptions :column="1" label-placement="top">
              <n-descriptions-item label="节点">
                <n-input :value="local.tunnel.args.nodeName"
                         @focus="local.tunnel.tabs = 'node'"
                         readonly placeholder="节点"/>
              </n-descriptions-item>
              <n-descriptions-item label="隧道名">
                <n-input v-model:value="local.tunnel.args.tunnelName" placeholder="隧道名">
                  <template #suffix>
                    <n-button
                        @click="local.tunnel.args.tunnelName = 'MNA-'+ String(Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000)"
                        text>
                      <template #icon>
                        <n-icon>
                          <ShuffleOutline/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                </n-input>
              </n-descriptions-item>
              <n-descriptions-item label="本地IP">
                <n-input v-model:value="local.tunnel.args.localIp" placeholder="本地IP">
                  <template #suffix>
                    <n-button @click="local.tunnel.args.localIp = '127.0.0.1'" text>
                      <template #icon>
                        <n-icon>
                          <AddOutline/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                </n-input>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
          <n-gi>
            <n-descriptions :column="1" label-placement="top">
              <n-descriptions-item label="协议">
                <n-select v-model:value="local.tunnel.args.tunnelType" :options="tunnelType" placeholder="协议"/>
              </n-descriptions-item>
              <n-descriptions-item label="远程端口">
                <n-input v-model:value="local.tunnel.args.remotePort" placeholder="远程端口">
                  <template #suffix>
                    <n-button
                        @click="local.tunnel.args.remotePort = String(Math.floor(Math.random() * (65565 - 10000 + 1)) + 10000)"
                        text>
                      <template #icon>
                        <n-icon>
                          <ShuffleOutline/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                </n-input>
              </n-descriptions-item>
              <n-descriptions-item label="本地端口">
                <n-input v-model:value="local.tunnel.args.localPort" placeholder="本地端口"/>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
        </n-grid>
      </n-scrollbar>
      <template #footer>
        <n-space>
          <n-button ghost type="error">删除</n-button>
          <n-button>启动</n-button>
          <n-button>保存</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
  <!--创建本地隧道-->
  <n-drawer style="-webkit-app-region: no-drag;"
            v-model:show="local.tunnel.show"
            :width="520">
    <n-drawer-content closable title="创建本地隧道">
      <n-scrollbar>
        <n-tabs v-model:value="local.tunnel.tabs">
          <n-tab-pane name="node" tab="节点">
            <n-list style="margin-top: 10px" hoverable clickable>
              <n-list-item
                  v-for="(item) in local.node.source"
                  @click="addLocalSelectedNode(item)">
                {{ item.nodeName }} <br>
                {{ item.nodeIp }}:{{ item.nodePort }}
              </n-list-item>
            </n-list>
          </n-tab-pane>
          <n-tab-pane name="args" tab="参数">
            <n-grid x-gap="12" :cols="2">
              <n-gi>
                <n-descriptions :column="1" label-placement="top">
                  <n-descriptions-item label="节点">
                    <n-input :value="local.tunnel.args.nodeName"
                             @focus="local.tunnel.tabs = 'node'"
                             readonly placeholder="节点"/>
                  </n-descriptions-item>
                  <n-descriptions-item label="隧道名">
                    <n-input v-model:value="local.tunnel.args.tunnelName" placeholder="隧道名">
                      <template #suffix>
                        <n-button
                            @click="local.tunnel.args.tunnelName = 'MNA-'+ String(Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000)"
                            text>
                          <template #icon>
                            <n-icon>
                              <ShuffleOutline/>
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                    </n-input>
                  </n-descriptions-item>
                  <n-descriptions-item label="本地IP">
                    <n-input v-model:value="local.tunnel.args.localIp" placeholder="本地IP">
                      <template #suffix>
                        <n-button @click="local.tunnel.args.localIp = '127.0.0.1'" text>
                          <template #icon>
                            <n-icon>
                              <AddOutline/>
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                    </n-input>
                  </n-descriptions-item>
                </n-descriptions>
              </n-gi>
              <n-gi>
                <n-descriptions :column="1" label-placement="top">
                  <n-descriptions-item label="协议">
                    <n-select v-model:value="local.tunnel.args.tunnelType" :options="tunnelType" placeholder="协议"/>
                  </n-descriptions-item>
                  <n-descriptions-item label="远程端口">
                    <n-input v-model:value="local.tunnel.args.remotePort" placeholder="远程端口">
                      <template #suffix>
                        <n-button
                            @click="local.tunnel.args.remotePort = String(Math.floor(Math.random() * (65565 - 10000 + 1)) + 10000)"
                            text>
                          <template #icon>
                            <n-icon>
                              <ShuffleOutline/>
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                    </n-input>
                  </n-descriptions-item>
                  <n-descriptions-item label="本地端口">
                    <n-input v-model:value="local.tunnel.args.localPort" placeholder="本地端口"/>
                  </n-descriptions-item>
                </n-descriptions>
              </n-gi>
            </n-grid>
          </n-tab-pane>
        </n-tabs>
      </n-scrollbar>
      <template #footer>
        <n-button @click="addLocalTunnelClick" style="width: 100%">创建</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
  <!--创建本地节点-->
  <n-drawer style="-webkit-app-region: no-drag;"
            v-model:show="local.node.show"
            :width="520">
    <n-drawer-content closable title="创建本地节点">
      <n-scrollbar>
        <n-grid x-gap="12" :cols="2">
          <n-gi>
            <n-descriptions :column="1" label-placement="top">
              <n-descriptions-item label="节点名称">
                <n-input v-model:value="local.node.args.nodeName"
                         placeholder="节点名称"/>
              </n-descriptions-item>
              <n-descriptions-item label="节点端口">
                <n-input v-model:value="local.node.args.nodePort"
                         placeholder="节点端口"/>
              </n-descriptions-item>
              <n-descriptions-item label="User">
                <n-input v-model:value="local.node.args.nodeUser"
                         placeholder="User"/>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
          <n-gi>
            <n-descriptions :column="1" label="top">
              <n-descriptions-item label="节点IP/域名">
                <n-input v-model:value="local.node.args.nodeIp"
                         placeholder="节点IP/域名"/>
              </n-descriptions-item>
              <n-descriptions-item label="Token">
                <n-input v-model:value="local.node.args.nodeToken"
                         placeholder="Token"/>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
        </n-grid>
      </n-scrollbar>
      <template #footer>
        <n-button @click="addLocalNodeClick" style="width: 100%">创建</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  AddOutline,
  CloudOutline,
  EarthOutline,
  GridOutline,
  LayersOutline,
  RefreshOutline,
  ShuffleOutline
} from "@vicons/ionicons5";
import {h, ref} from "vue";
import {NIcon, useMessage} from "naive-ui";
import fs from "node:fs";
import path from "node:path";

const message = useMessage();
const loading = ref(true);
const local = ref({
  tunnel: {
    tabs: "node",
    show: false,
    source: JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/tunnel.json"), "utf-8")).tunnels,
    options: [
      {
        label: '本地',
        key: 'local',
        icon() {
          return h(NIcon, null, {
            default: () => h(LayersOutline)
          })
        },
        children: [
          {
            label: '隧道',
            key: 'localTunnel',
            icon() {
              return h(NIcon, null, {
                default: () => h(GridOutline)
              })
            },
          }, {
            label: '节点',
            key: 'localNode',
            icon() {
              return h(NIcon, null, {
                default: () => h(CloudOutline)
              })
            },
          }
        ]
      }, {
        label: '远程',
        key: 'remote',
        disabled: true,
        icon() {
          return h(NIcon, null, {
            default: () => h(EarthOutline)
          })
        }
      }
    ],
    args: {
      nodeName: "",
      nodeId: "",
      tunnelName: "",
      tunnelId: "",
      tunnelType: "tcp",
      localIp: "",
      localPort: "",
      remotePort: "",
      user: ""
    }
  },
  node: {
    show: false,
    source: JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/node.json"), "utf-8")).nodes,
    args: {
      nodeName: "",
      nodeId: "",
      nodeIp: "",
      nodePort: "",
      nodeToken: "",
      nodeUser: ""
    }
  }
});
const tunnel = ref({
  show: false,
});
const tunnelType = ref([
  {
    label: 'TCP',
    value: 'tcp'
  }, {
    label: 'UDP',
    value: 'udp'
  }, {
    label: 'HTTP',
    value: 'http'
  }, {
    label: 'HTTPS',
    value: 'https'
  }, {
    label: 'XTcp',
    value: 'xtcp'
  }, {
    label: 'STcp',
    value: 'stcp'
  }
]);

// 获取本地隧道
getLocalTunnel();
function getLocalTunnel() {
  loading.value = true;
  local.value.tunnel.source =
      JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/tunnel.json"), "utf-8")).tunnels;
  loading.value = false;
}

// 选中隧道
function selectTunnel(key: any) {
  tunnel.value.show = true;
  local.value.tunnel.args = key;
}

// 添加隧道
function showLocalTunnelClick(key: string) {
  local.value.tunnel = {
    ...local.value.tunnel,
    tabs: "node",
    show: false,
    args: {
      nodeName: "",
      nodeId: "",
      tunnelName: "",
      tunnelId: "",
      tunnelType: "tcp",
      localIp: "",
      localPort: "",
      remotePort: "",
      user: ""
    }
  };
  local.value.node = {
    show: false,
    source: JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/node.json"), "utf-8")).nodes,
    args: {
      nodeName: "",
      nodeId: "",
      nodeIp: "",
      nodePort: "",
      nodeToken: "",
      nodeUser: ""
    }
  }
  if (key === "localTunnel") local.value.tunnel.show = true;
  else if (key === "localNode") local.value.node.show = true;
}
// 添加本地隧道
function addLocalTunnelClick () {
  const tunnelPath = path.join(process.cwd(), "data/tunnel.json");
  const data = JSON.parse(fs.readFileSync(tunnelPath, "utf-8"));
  local.value.tunnel.show = false;
  local.value.tunnel.args.tunnelId = String(Date.parse(new Date().toString()));
  data.tunnels.push(local.value.tunnel.args);
  fs.writeFileSync(tunnelPath, JSON.stringify(data, null, 2));
  message.success(`已创建隧道 ${local.value.tunnel.args.tunnelName}`);
  getLocalTunnel();
}
// 添加时选中本地节点
function addLocalSelectedNode(key: any) {
  message.info(`已选择节点 ${key.nodeName}`);
  local.value.tunnel.tabs = "args";
  local.value.tunnel.args.nodeName = key.nodeName;
  local.value.tunnel.args.nodeId = key.nodeId;
}

// 添加本地节点
function addLocalNodeClick() {
  const nodePath = path.join(process.cwd(), "data/node.json");
  const data = JSON.parse(fs.readFileSync(nodePath, "utf-8"));
  local.value.node.show = false;
  local.value.node.args.nodeId = String(Date.parse(new Date().toString()));
  data.nodes.push(local.value.node.args);
  fs.writeFileSync(nodePath, JSON.stringify(data, null, 2));
  message.success(`已创建节点 ${local.value.node.args.nodeName}`);
}
</script>