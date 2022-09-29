<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-28 17:35:35
 * @LastEditTime: 2022-09-28 18:10:59
 * @FilePath: /cvat-admin/src/components/views/Login.vue
 * @Description: file information
-->
<script setup lang="ts">
import { ref } from 'vue'
import { message, Modal } from 'ant-design-vue'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'

defineProps<{
  msg: string
}>()

const count = ref(0)
</script>

<template>
  <div id="components-layout-demo-basic" class="index">
    <a-layout>
      <a-layout-header>Header</a-layout-header>
      <a-layout>
        <a-layout-content>Content</a-layout-content>
        <a-layout-sider>Sider</a-layout-sider>
      </a-layout>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
    <!-- <a-layout>
      <a-layout-content>
        <div class="login-div">
          <a-card title="视觉标注工作平台-V3" bodyStyle="{padding:24px}">
            {{ msg }}--<button @click="count++">{{ count }}</button>
            <a-input v-model:value="account" placeholder="请输入手机号或邮箱" />
            <a-input-password
              v-model:value="password"
              placeholder="请输入密码"
            />
            <a-button type="primary" @click="goTo" @keyup.enter="goTo" block
              >登录</a-button
            >
            <a-tag color="blue" class="mt-3">推荐使用谷歌浏览器，您将获得最佳使用体验~</a-tag>
          </a-card>
        </div>
      </a-layout-content>
      <a-layout-footer
        >©版权所有：北京公司
        京ICP备1</a-layout-footer
      >
    </a-layout> -->
  </div>
</template>

<style scoped>
.login-div {
  margin-top: -100px;
  width: 450px;
}
input[type='text'],
.ant-input-affix-wrapper,.ant-select-selector {
  height: 50px;
}
.ant-select-selector,.ant-select-selection-item{
  height: 50px!important;
  line-height: 50px;
}
.ant-btn-block {
  margin-top: 12px;
  height: 50px;
}
#components-layout-demo-basic {
  height: 100%;
  text-align: center;
}
.ant-layout {
  height: 100%;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  /* background: #7dbcea; */
  background: #282c34;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #282c34;
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout{
  background: #282c34;
  /* background: linear-gradient(to bottom,#063b6d,#282c34); */
  /* background-image: url(https://speechocean-bj.oss-cn-beijing.aliyuncs.com/vds_publish/images/back.svg); */
  /* background-repeat: no-repeat;
  background-size: contain; */
}
#components-layout-demo-basic .ant-layout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  /* background: rgba(16, 142, 233, 1); */
  color: #fff;
  min-height: 120px;
  line-height: 120px;
  /* background-image: url(https://speechocean-bj.oss-cn-beijing.aliyuncs.com/vds_publish/images/back.svg); */
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
</style>
