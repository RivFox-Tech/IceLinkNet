<template>
  <n-flex vertical>
    <!--操作-->
    <n-card size="small">
      <div>
        <n-button disabled secondary strong>
          刷新
          <template #icon>
            <n-icon>
              <RefreshOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-button disabled style="margin-left: 10px" secondary strong>
          添加
          <template #icon>
            <n-icon>
              <AddOutline/>
            </n-icon>
          </template>
        </n-button>
        <n-select disabled style="width: 180px;
                    float: right;"
                  placeholder="请选择下载源"
        />
      </div>
    </n-card>
    
    <!--数据展示-->
    <n-card v-show="false" style="margin-top: 10px" size="small">
      
    </n-card>

    <div style="text-align: center; margin-top: 20%">
      扩展商店开发ing...<br>
      完成后 服务商/个人 可上架扩展
    </div>
  </n-flex>
</template>


<script setup lang="ts">
import {AddOutline, RefreshOutline} from "@vicons/ionicons5";


</script>