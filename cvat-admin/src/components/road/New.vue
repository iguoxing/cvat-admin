<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-06 10:33:26
 * @LastEditTime: 2022-10-06 11:20:23
 * @FilePath: /cvat-admin/src/components/road/New.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import type { Dayjs } from "dayjs";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();

const selectedRowKeys = ref([]);
const form = ref({
  name: "",
  describe: "",
  start_date: "",
  end_date: ref<Dayjs>(),
});
const rules = {
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  date: [{ required: true, message: "请选择项目时间", trigger: "blur" }],
};
function goToBack() {
  router.push({ name: "roadIndex" });
}
function onSelectChange(selectedRowKeys) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
}
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects",
      params: {
        page: 1,
        page_size: 10,
        // filter: JSON.stringify(['name', 'owner', 'assignee', 'status', 'id', 'updated_date','start_date','end_date']),
        // search: 'name'
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result) => {
    if (result) {
      res.value = result.results;
      console.log(res.value);
    }
  });
}
onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <a-page-header title="新建路线" @back="goToBack" />
    <a-form
      class="margin-top-1"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
      :rules="rules"
    >
      <a-form-item ref="name" label="名称" name="name">
        <a-input v-model:value="form.name" placeholder="请填写名称" />
      </a-form-item>
      <a-form-item ref="company" label="描述" name="company">
        <a-textarea
          v-model:value="form.describe"
          placeholder="请填写项目描述"
        />
      </a-form-item>
      <a-form-item ref="date" label="项目时间" name="date">
        <a-date-picker v-model:value="form.start_date" placeholder="开始日期" />
        <a-date-picker
          v-model:value="form.end_date"
          placeholder="结束日期"
          class="ml-3"
        />
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
