<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-28 17:35:35
 * @LastEditTime: 2022-11-28 15:33:31
 * @FilePath: /cvat-admin/src/components/views/Login.vue
 * @Description: file information
-->
<template>
  <div id="components-layout-demo-basic" class="index">
    <a-layout>
      <a-layout-content>
        <div class="login-div">
          <a-card title="iSTL 标注平台管理端V1.0" bodyStyle="{padding:24px}">
            <!-- {{ msg }}--<button @click="count++">{{ count }}</button> -->
            <a-input v-model:value="account" placeholder="请输入手机号或邮箱" />
            <a-input-password
              v-model:value="password"
              placeholder="请输入密码"
            />
            <a-button type="primary" @click="goTo" @keyup.enter="goTo" block>
              登录
            </a-button>
            <a-tag color="blue" class="mt-3">推荐使用<a href="http://chrome.data3d.com.cn/" target="_blank" style="text-decoration:underline;">谷歌浏览器</a>，您将获得最佳使用体验~</a-tag>
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
      localStorage.personinfo = JSON.stringify(result.info);
      const groups = result && result.info && result.info.groups
      if (groups.includes("admin")) {
        router.push({ name: "home" });
      } else {
        window.open(import.meta.env.VITE_APP_BASE_URL, "_self");
      }
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
  /* background-image: url(https://s2.loli.net/2022/10/24JgE2dv57LNkORlp.jpg); */
  background-image: url(http://iguoxing.oss-cn-beijing.aliyuncs.com/cvat/img/bg-2.jpg);
  /* background-image: url(https://speechocean-bj.oss-cn-beijing.aliyuncs.com/vds_publish/images/back.svg); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /* background-size: cover; */
  /* background-size: contain; */
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
.ant-card-bordered {
  opacity: 0.96;
}
</style>
