<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-13 14:21:27
 * @LastEditTime: 2022-10-13 16:11:58
 * @FilePath: /cvat-admin/src/components/task/New.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import axios from "../../stores/interface";
import type { Dayjs } from "dayjs";
import dayjs from 'dayjs';
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// console.log("router: ", router);
console.log("route: ", route);
console.log("route params: ", route.params);
const pid = route.params && route.params.id;
const projectTitle = '新建桩号' + (JSON.parse(localStorage.projectInfo).name ? ('-' + JSON.parse(localStorage.projectInfo).name) : '')

const selectedRowKeys = ref([]);let form = ref({
  name: "test",
  describe: "测试",
  start_date: "",
  startDate: ref<Dayjs>(),
  endDate: ref<Dayjs>(),
  end_date: "",
  files_path: "/hzf_test/",
  org_width: "80",
  org_height: "80",
});
const rules = {
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  // date: [{ required: true, message: "请选择项目时间", trigger: "blur" }],
};

function getProjectInfo() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid,
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      form.value = result;
      form.value.startDate = dayjs(result.start_date || "");
      form.value.endDate = dayjs(result.end_date || "");
      form.value = {
        name: result.name,
        describe: result.describe,
        start_date: result.start_date,
        startDate: dayjs(result.start_date || ""),
        endDate: dayjs(result.end_date || ""),
        end_date: result.end_date,
        files_path: result.files_path,
        org_width: result.org_width,
        org_height: result.org_height,
      }
    }
  });
}

pid && getProjectInfo();

function save() {
  console.log(form)
  console.log(form.value)
  if (form.value && form.value.startDate) {
    form.value.start_date = dayjs(form.value.startDate).format('YYYY-MM-DD')
  }
  if (form.value && form.value.endDate) {
    form.value.end_date = dayjs(form.value.endDate).format('YYYY-MM-DD')
  }
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
  console.log('add');
}
function cancel() {
  router.go(-1);
}
onMounted(() => {
  // getList();
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
    <a-form
      class="margin-top-1"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
      :rules="rules"
    >
      <a-form-item ref="name" label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="请填写名称" class="w-1/2"/>
      </a-form-item>
      <a-form-item ref="company" label="描述" name="company">
        <a-textarea
          v-model:value="form.describe"
          placeholder="请填写项目描述"
        />
      </a-form-item>
      <a-form-item ref="date" label="项目时间" name="date">
        <a-date-picker v-model:value="form.startDate" format="YYYY-MM-DD" placeholder="开始日期" />
        <a-date-picker
          v-model:value="form.endDate"
          placeholder="结束日期"
          class="ml-3"
        />
      </a-form-item>
      <a-form-item label="图片文件夹">
        <a-input v-model:value="form.files_path" placeholder="请填写图片文件夹"/>
      </a-form-item>
      <a-form-item label="图片宽度">
        <a-input class="w-1/2" v-model:value="form.org_width" placeholder="请填写图片实际宽度" />
      </a-form-item>
      <a-form-item label="图片高度">
        <a-input class="w-1/2" v-model:value="form.org_height" placeholder="请填写图片实际高度" />
      </a-form-item>
    </a-form>
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
