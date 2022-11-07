<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-30 11:14:20
 * @LastEditTime: 2022-11-07 10:02:19
 * @FilePath: /cvat-admin/src/components/frame/Frame.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { message } from "ant-design-vue";
import {
  HomeOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";

import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
// import router from '../../router/index'

// defineProps<{
//   msg: string
// }>()

const collapsed = false;
const selectedKeys = ref([]);
const openKeys = ref([]);
const subMenu = ref("");
const isRouterAlive = ref(true);
const router = useRouter();
const route = useRoute();
const personInfo = JSON.parse(localStorage.personinfo);
// debugger;

onMounted(() => {
  // console.log(router)
  // console.log(route.path)
  selectedKeys.value.push(setMenu(route.path));
  openKeys.value.push(subMenu.value);
});

watch(selectedKeys, (val, old) => {
  console.log("val", val);
  console.log("old", old);
  if (val[0] == "100") {
    router.push({ name: "home" });
  }
  if (val[0] == "200") {
    router.push({ name: "road" });
  }
  if (val[0] == "300") {
    router.push({ name: "task" });
  }
  if (val[0] == "400") {
    router.push({ name: "person" });
  }
  if (val[0] == "500") {
    router.push({ name: "template" });
  }
});

function setMenu(val: string) {
  let k = "";
  let m = "";

  switch (val) {
    case "/home/index":
      k = "100";
      break;
    case "/road/index":
      k = "200";
      break;
    case "/task/index":
      k = "300";
      break;
    case "/person/index":
      k = "400";
      break;
    case "/template/index":
      k = "500";
      break;
  }
  subMenu.value = m;
  return k;
}

function gotoChange() {
  window.open("");
}

function exitLogin() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: import.meta.env.VITE_APP_BASE_URL + "api/auth/logout",
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    localStorage.removeItem("token");
    router.push({ name: "login" });
  });
}
</script>
<template>
  <a-layout id="components-layout-demo-custom-trigger" class="frame">
    <!-- v-model:collapsed="collapsed" -->
    <a-layout-sider :trigger="null" collapsible class="sideMenu">
      <div class="logo">
        <!-- iSTL 管理端 -->
        <!-- <span class="ml-3 text-xl font-bold">ISTL</span> -->
        <img src="../../assets/ISTL.svg" class="ml-3"/>
        <!-- <img src="https://s2.loli.net/2022/10/31/PXTwao7jthVvLlE.png" class="ml-3"/> -->
        <a
          href="http://43.138.66.202:8080/projects?page=1"
          target="_blank"
          class="ml-6 mr-3"
        >
          路线
        </a>
        <a
          href="http://43.138.66.202:8080/tasks?page=1"
          target="_blank"
          class="mr-3"
        >
          桩号
        </a>
      </div>
      <!-- theme="dark" -->
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
      >
        <a-menu-item key="100">
          <HomeOutlined />
          <span :menu="100">主页</span>
        </a-menu-item>
        <a-menu-item key="200">
          <ProjectOutlined />
          <span :menu="200">路线管理</span>
        </a-menu-item>
        <a-menu-item key="300">
          <UnorderedListOutlined />
          <span :menu="300">桩号管理</span>
        </a-menu-item>
        <a-menu-item key="500">
          <TagsOutlined />
          <span :menu="500">标签模板</span>
        </a-menu-item>
        <a-menu-item key="400">
          <TeamOutlined />
          <span :menu="400">人员管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="page-header">
          <!-- <div>
            <a
              href="http://43.138.66.202:8080/projects?page=1"
              target="_blank"
              class="ml-6 mr-3"
            >
              路线
            </a>
            <a
              href="http://43.138.66.202:8080/tasks?page=1"
              target="_blank"
              class="mr-3"
            >
              桩号
            </a>
          </div> -->
          <!-- <a href="http://43.138.66.202:8080" target="_blank" class="mr-3">
            <a-tag class="ant-hand" color="blue">跳转到标注端</a-tag>
          </a> -->
          <!-- <a
            href="http://43.138.66.202:8080/tasks?page=1"
            target="_blank"
            class="mr-3"
          >
            <a-tag class="ant-hand" color="cyan">返回任务列表</a-tag>
          </a> -->
          <a-dropdown class="pre-step" :offset="1">
            <a class="ant-dropdown-link" @click.prevent>
              <UserOutlined />
              <span class="ml-3">
                {{ personInfo.username }}
                <!-- {{ person.name }} -->
              </span>
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <!-- <a-menu-item @click="gotoChange" class="text-center">
                  <EditOutlined /> 更改密码
                </a-menu-item> -->
                <a-menu-item @click="exitLogin" class="text-center">
                  <LogoutOutlined /> 登出
                  <!-- <a-tag
                    class="ant-hand"
                    color="#f50"
                    type="danger"
                    size="small"
                    >退出</a-tag
                  > -->
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="layout-content">
        <transition name="fade-transform" mode="out-in">
          <router-view v-if="isRouterAlive" />
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
.frame {
  height: 100%;
}

.ant-layout-header {
  display: flex;
}

.ant-menu {
  text-align: left;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  display: flex;
  align-items: center;
  /* margin: 16px; */
  height: 64px;
  /* height: 37px; */
  background: #72bbf7;
  /* background: url(https://s2.loli.net/2022/10/31/PXTwao7jthVvLlE.png); */
  /* background: url(../../assets/img/logo.png); */
  background-size: contain;
  /* background-size: 96%; */
  background-repeat: no-repeat;
  text-align: center;
  font-size: 15px;
  color: #000;
}
.layout-content {
  display: inline-block;
  overflow-y: scroll;
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
.help-word {
  margin-right: 60px;
  color: #999;
}
.page-header {
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 8px;
  background: #72bbf7;
}
.msg-icon {
  font-size: 18px;
  margin-right: 2px;
}
.sideMenu .anticon svg {
  display: block;
}

.ant-layout .ant-layout-sider {
  background: #fff;
  /* background: #282c34; */
  color: #fff;
  /* line-height: 120px; */
}
</style>
