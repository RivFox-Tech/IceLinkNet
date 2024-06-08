<template style="height: 100%">
  <n-config-provider style="height: 100%" :theme="theme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <n-layout style="height: 100%">
              <n-layout-header position="absolute" style="-webkit-app-region: drag;" bordered>
                <div style="display: flex; justify-content: space-between; height: 40px">
                  <p style="margin-left: 12px; margin-top: 9px">MoonNetwork</p>
                  <n-flex style="-webkit-app-region: no-drag; margin-right: 12px; margin-top: -1px">
                    <n-button :focusable="false" @click="minimize" class="draggable-button" text>
                      <template #icon>
                        <n-icon>
                          <RemoveOutline style="font-size: 20px;"/>
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button style="margin-right: -2px;" :focusable="false" @click="maximize" class="draggable-button" text>
                      <template #icon>
                        <n-icon>
                          <StopOutline style="font-size: 18px; margin-top: 1px;"/>
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button :focusable="false" @click="close" class="draggable-button" text>
                      <template #icon>
                        <n-icon>
                          <CloseOutline style="font-size: 20px;"/>
                        </n-icon>
                      </template>
                    </n-button>
                  </n-flex>
                </div>
              </n-layout-header>
              <n-layout position="absolute" style="top: 41px;" has-sider>
                <n-layout-sider
                    bordered
                    :native-scrollbar="false"
                    :default-collapsed="true"
                    collapse-mode="width"
                    :collapsed-width="60">
                  <n-menu
                      style="margin-top: 2px"
                      v-model:value="menuValue"
                      :collapsed-width="60"
                      :collapsed-icon-size="20"
                      responsive
                      :options="menu"
                      @update:value="footerValue = '' "
                  />
                  <n-menu
                      style="bottom: 0; position: fixed; width: 60px; margin-bottom: 3px"
                      v-model:value="footerValue"
                      :collapsed-width="60"
                      :collapsed-icon-size="20"
                      responsive
                      :options="footer"
                      @update:value="menuValue = ''"
                  />
                </n-layout-sider>

                <n-layout :native-scrollbar="false" embedded style="margin: 24px;">
                  <router-view/>
                </n-layout>
              </n-layout>
            </n-layout>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {darkTheme, type MenuOption} from "naive-ui";
import {
  CloseOutline,
  ExtensionPuzzleOutline,
  GridOutline,
  HomeOutline,
  MenuOutline,
  PersonCircleOutline,
  RemoveOutline,
  SettingsOutline,
  StopOutline
} from "@vicons/ionicons5"
import {h, ref} from "vue";
import {RouterLink, useRouter} from "vue-router";
import {ipcRenderer} from "electron";
import PubSub from "pubsub-js";
import icon from "./services/icon.ts";

const themeOverrides = {
  common: {
    primaryColor: "#70c0e8",
    primaryColorHover: "#8acbec",
    primaryColorPressed: "#66AFD3FF",
    primaryColorSuppl: "rgb(56, 137, 197)"
  },
  Card: {
    titleFontWeight: 1000
  }
}
const menuValue = ref("home");
const footerValue = ref("");
const router = useRouter();
const theme: any = ref(darkTheme);

const menu: MenuOption[] = [
  {
    label: () => h(RouterLink, {to: {path: "/home"}}, {default: () => "主页"}),
    icon: icon(HomeOutline),
    key: "home"
  }, {
    label: () => h(RouterLink, {to: {path: "/tunnels"}}, {default: () => "隧道"}),
    icon: icon(GridOutline),
    key: "tunnels"
  }, {
    label: () => h(RouterLink, {to: {path: "/logs"}}, {default: () => "日志"}),
    icon: icon(MenuOutline),
    key: "logs"
  }, {
    label: () => h(RouterLink, {to: {path: "/plugins"}}, {default: () => "扩展"}),
    icon: icon(ExtensionPuzzleOutline),
    key: "plugins"
  }
];
const footer: MenuOption[] = [
  {
    label: () => h(RouterLink, {to: {path: "/account"}}, {default: () => "账号"}),
    icon: icon(PersonCircleOutline),
    key: "account"
  }, {
    label: () => h(RouterLink, {to: {path: "/settings"}}, {default: () => "设置"}),
    icon: icon(SettingsOutline),
    key: "settings"
  }
];

function minimize() {
  ipcRenderer.send("minimize");
}

function maximize() {
  ipcRenderer.send("maximize");
}

function close() {
  ipcRenderer.send("close");
}

router.push("/home");
PubSub.subscribe("theme", (msg, data) => {
  if (data === "light") {
    theme.value = null;
  }
  if (data === "dark") {
    theme.value = darkTheme;
  }
})
</script>