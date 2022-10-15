<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-13 14:21:27
 * @LastEditTime: 2022-10-15 11:20:38
 * @FilePath: /cvat-admin/src/components/task/New.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import axios from "../../stores/interface";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

console.log("route: ", route);
console.log("route params: ", route.params);
const pid = route.params && route.params.id;
const projectTitle =
  "新建桩号" +
  (JSON.parse(localStorage.projectInfo).name
    ? "-" + JSON.parse(localStorage.projectInfo).name
    : "");

let form = ref([
  {
    name: "test", // 任务名称
    describe: "测试",
    start_date: "",
    startDate: ref<Dayjs>(),
    endDate: ref<Dayjs>(),
    end_date: "",
    files_path: "/hzf_test/",
    org_width: "80",
    org_height: "80",
  },
]);
const rules = {
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  // date: [{ required: true, message: "请选择项目时间", trigger: "blur" }],
};

function getProjectTask() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid + "/tasks",
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      console.log("result", result);
    }
  });
}

pid && getProjectTask();

function save() {
  console.log(form);

  const promise = new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects",
      data: form.value,
    }).then(function (data) {
      resolve(data);
    });
  });

  promise.then((result) => {
    router.push({ name: "road" });
    // if (result) {
    //   router.push({ name: "road" });
    //   console.log(result);
    // }
  });
}
function add() {
  console.log("add");
}
function cancel() {
  router.go(-1);
}
onMounted(() => {
  // getProjectTask();
});
</script>

<template>
  <div>
    <a-page-header :title="projectTitle" @back="cancel" />
    <a-row type="flex" justify="center" align="start" class="mt-3">
      <a-col>
        <a-button type="primary" @click="add" class="mb-3">
          <PlusOutlined />
        </a-button>
      </a-col>
    </a-row>

    <a-row type="flex" justify="center" align="start" class="mt-3">
      <a-col>
        <a-button data-test="saveFun" type="primary" @click="save">
          保存
        </a-button>
        <a-button class="ml-3" @click="cancel"> 取消 </a-button>
      </a-col>
    </a-row>
  </div>
</template>
