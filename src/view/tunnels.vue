<template>
  <!--操作-->
  <n-card size="small">
    <div>
      <n-button secondary strong>
        刷新
        <template #icon>
          <n-icon>
            <RefreshOutline/>
          </n-icon>
        </template>
      </n-button>
      <n-dropdown trigger="hover" :options="local.tunnel.options" @select="showTunnelClick">
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

  <!--数据展示-->
  <n-list style="margin-top: 10px" hoverable clickable>
    <n-list-item
        v-for="(item) in data"
        :key="item"
    >
      {{ item.name }} #{{ item.id }}
    </n-list-item>
  </n-list>

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
                  v-for="(item) in data"
                  @click="selectedTunnel(item)">
                {{ item.name }} #{{ item.id }}
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
                    <n-input :value="local.tunnel.args.tunnelName" placeholder="隧道名">
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
                    <n-input :value="local.tunnel.args.localIp" placeholder="本地IP">
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
                    <n-select value="tcp" :options="tunnelType" placeholder="协议"/>
                  </n-descriptions-item>
                  <n-descriptions-item label="远程端口">
                    <n-input :value="local.tunnel.args.remotePort" placeholder="远程端口">
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
                    <n-input :value="local.tunnel.args.localPort" placeholder="本地端口"/>
                  </n-descriptions-item>
                </n-descriptions>
              </n-gi>
            </n-grid>
          </n-tab-pane>
        </n-tabs>
      </n-scrollbar>
      <template #footer>
        <n-button @click="addTunnelClick" style="width: 100%">创建</n-button>
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
                <n-input :value="local.node.args.nodeName"
                         placeholder="节点名称"/>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
          <n-gi>
            <n-descriptions :column="1" label-placement="top">
              <n-descriptions-item label="协议">
                <n-select value="tcp" :options="tunnelType" placeholder="协议"/>
              </n-descriptions-item>
            </n-descriptions>
          </n-gi>
        </n-grid>
      </n-scrollbar>
      <template #footer>
        <n-button @click="addNodeClick" style="width: 100%">创建</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  AddOutline,
  RefreshOutline,
  CloudOutline,
  EarthOutline,
  LayersOutline,
  ShuffleOutline
} from "@vicons/ionicons5";
import {h, ref} from "vue";
import {NIcon, useMessage} from "naive-ui";

const message = useMessage();
const local = ref({
  tunnel: {
    tabs: "node",
    show: false,
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
          }, {
            label: '节点',
            key: 'localNode',
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
      localIp: "",
      localPort: "",
      remotePort: ""
    }
  },
  node: {
    show: false,
    args: {
      nodeName: ""
    }
  }
});
const data = ref([
  {
    "name": "MN-123asjhisodh",
    "id": "215673",
    "type": "123",
    "status": "123",
    "createTime": "123",
    "updateTime": "123",
  }, {
    "name": "MN-114514",
    "id": "215673",
    "type": "123",
    "status": "123",
    "createTime": "123",
    "updateTime": "123",
  }
]);
const tunnelType = [
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
];

function showTunnelClick(key: string) {
  local.value.tunnel = {
    tabs: "node",
    show: false,
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
          }, {
            label: '节点',
            key: 'localNode',
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
      localIp: "",
      localPort: "",
      remotePort: ""
    }
  };
  if (key === "localTunnel") local.value.tunnel.show = true;
  else if (key === "localNode") local.value.node.show = true;
}
function addTunnelClick () {
  message.info(`已创建隧道 ${local.value.tunnel.args.tunnelName}`);
  local.value.tunnel.show = false;
}
function addNodeClick() {
  
}
function selectedTunnel(key: any) {
  message.info(`已选择节点 ${key.name}`);
  local.value.tunnel.tabs = "args";
  local.value.tunnel.args.nodeName = key.name;
  local.value.tunnel.args.nodeId = key.id;
}
</script>