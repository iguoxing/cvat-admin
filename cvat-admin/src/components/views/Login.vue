<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-28 17:35:35
 * @LastEditTime: 2022-10-21 18:24:51
 * @FilePath: /cvat-admin/src/components/views/Login.vue
 * @Description: file information
-->
<template>
  <div id="components-layout-demo-basic" class="index">
    <a-layout>
      <a-layout-content>
        <div class="login-div">
          <a-card title="iSTL 标注平台管理端" bodyStyle="{padding:24px}">
            <!-- {{ msg }}--<button @click="count++">{{ count }}</button> -->
            <a-input v-model:value="account" placeholder="请输入手机号或邮箱" />
            <a-input-password
              v-model:value="password"
              placeholder="请输入密码"
            />
            <a-button type="primary" @click="goTo" @keyup.enter="goTo" block>
              登录
            </a-button>
          </a-card>
        </div>
      </a-layout-content>
      <!-- <a-layout-footer
        >©版权所有：北京公司
        京ICP备1</a-layout-footer
      > -->
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message, Modal } from "ant-design-vue";

import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
// import router from '../../router/index'

// defineProps<{
//   msg: string
// }>()

const account = ref(null);
const password = ref(null);
const router = useRouter();

console.log(import.meta.env)

function goTo() {
  localStorage.removeItem("token");
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: import.meta.env.VITE_APP_BASE_URL + "api/auth/login",
      data: {
        username: account.value,
        password: password.value,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result && result.key) {
      localStorage.token = result.key;
      router.push({ name: "home" });
    }
  });
}
</script>
<style scoped>
.login-div {
  margin-top: -100px;
  width: 450px;
}
input[type="text"],
.ant-input-affix-wrapper,
.ant-select-selector {
  height: 50px;
}
.ant-select-selector,
.ant-select-selection-item {
  height: 50px !important;
  line-height: 50px;
}
.ant-btn-block {
  margin-top: 12px;
  height: 50px;
}
#components-layout-demo-basic {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  background: #282c34;
}
.ant-layout {
  height: 100%;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #282c34;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #fff;
  /* background: #282c34; */
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout {
  background: #0087ed;
  /* background: #282c34; */
  /* background: linear-gradient(to bottom,#063b6d,#282c34); */
  background-image: url(https://speechocean-bj.oss-cn-beijing.aliyuncs.com/vds_publish/images/back.svg);
  background-repeat: no-repeat;
  background-size: contain;
}
#components-layout-demo-basic .ant-layout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #282c34; */
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
