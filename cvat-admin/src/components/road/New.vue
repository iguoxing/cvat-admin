<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-06 10:33:26
 * @LastEditTime: 2022-11-21 16:48:02
 * @FilePath: /cvat-admin/src/components/road/New.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// console.log("router: ", router);
// console.log("route: ", route);
// console.log("route params: ", route.params);
const pid = route.params && route.params.id;

let templateList = ref([]);
let labelType = ref([
  { id: "rectangle", name: "矩形" },
  // { id: "bbox", name: "矩形" },
  { id: "ellipse", name: "椭圆" },
  { id: "polyline", name: "曲线" },
  { id: "tag", name: "标签" },
]);
let form = ref({
  name: "test",
  describe: "测试",
  start_date: "",
  startDate: ref<Dayjs>(),
  endDate: ref<Dayjs>(),
  end_date: "",
  files_path: "/hzf_test/",
  label_id: [],
  labels: [],
  qa_rate: "50",
  qa_segment: "3",
  org_width: "80",
  org_height: "80",
  image_quality: "70",
  grid_size: "10",
});
const rules = {
  name: [{ required: true, message: "请填写名称", trigger: "blur" }],
  date: [{ required: true, message: "请填写项目时间", trigger: "change", validator: validateDates }],
  label_id: [{ required: true, message: "请填写标签模板", trigger: "blur" }],
  qa_rate: [{ required: true, message: "请填写抽检比例", trigger: "blur" }],
  qa_segment: [{ required: true, message: "请填写抽检段数", trigger: "blur" }],
  org_width: [{ required: true, message: "请填写图片实际宽度", trigger: "blur" }],
  org_height: [{ required: true, message: "请填写图片实际高度", trigger: "blur" }],
  image_quality: [{ required: true, message: "请填写图片质量", trigger: "blur" }],
  grid_size: [{ required: true, message: "请填写表格尺寸", trigger: "blur" }],
  files_path: [
    { required: true, message: "请填写图片文件夹", trigger: "blur" },
  ],
};

function validateDates(rule, value) {
  if (value === '') {
    return Promise.reject('请填写项目时间')
  }
}

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
      form.value = {
        name: result.name,
        describe: result.describe,
        start_date: result.start_date,
        startDate: result.start_date ? dayjs(result.start_date) : dayjs(),
        endDate: result.start_date ? dayjs(result.end_date) : dayjs(),
        end_date: result.end_date,
        files_path: result.files_path ? result.files_path : "/hzf_test/",
        qa_rate: result.qa_rate,
        qa_segment: result.qa_segment,
        org_width: result.org_width,
        org_height: result.org_height,
        image_quality: result.image_quality,
        grid_size: result.grid_size,
        labels: result.labels,
      };
    }
  });
}

pid && getProjectInfo();

function addRoad(road) {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects",
      data: road,
    }).then(function (data) {
      resolve(data);
    });
  });

  promise.then((result) => {
    router.push({ name: "road" });
  });
}

function editRoad(road) {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid,
      data: road,
    }).then(function (data) {
      resolve(data);
    });
  });

  promise.then((result) => {
    router.push({ name: "road" });
  });
}

function save() {
  // console.log(form);
  // console.log(form.value);
  if (form.value && form.value.startDate) {
    form.value.start_date = dayjs(form.value.startDate).format("YYYY-MM-DD");
  }
  if (form.value && form.value.endDate) {
    form.value.end_date = dayjs(form.value.endDate).format("YYYY-MM-DD");
  }
  if (pid) {
    editRoad(form.value);
  } else {
    addRoad(form.value);
  }
}

function getTemplateList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/templates",
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      templateList.value = result.results;
    }
  });
}

function chooseLabel() {
  form.value.labels = [];
  templateList.value.forEach((value: any) => {
    if (form.value.label_id.includes(value.id)) {
      value.labels.forEach((item: any) => {
        form.value.labels.push({
          name: item.name,
          color: item.color,
          code: item.code,
          attributes: item.attributes,
          type: item.type,
          template_id: item.template_id,
          template_name: item.template_name,
          template_label_id: item.template_label_id,
        });
      });
      // form.value.labels = value.labels;
    }
  });
  console.log(form.value.labels);
}

function cancel() {
  router.go(-1);
}
onMounted(() => {
  getTemplateList();
});
</script>

<template>
  <div>
    <a-page-header title="维护路线" @back="cancel" />
    <a-form
      class="margin-top-1"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
      :rules="rules"
    >
      <a-form-item ref="name" label="名称" name="name">
        <a-input
          v-model:value="form.name"
          placeholder="请填写名称"
          class="w-1/2"
        />
      </a-form-item>
      <a-form-item ref="company" label="描述" name="company">
        <a-textarea
          v-model:value="form.describe"
          placeholder="请填写项目描述"
        />
      </a-form-item>
      <a-form-item ref="date" label="项目时间" name="date">
        <a-date-picker
          v-model:value="form.startDate"
          format="YYYY-MM-DD"
          placeholder="开始日期"
        />
        <a-date-picker
          v-model:value="form.endDate"
          placeholder="结束日期"
          class="ml-3"
        />
      </a-form-item>
      <a-form-item label="图片文件夹" ref="files_path" name="files_path">
        <a-input
          v-model:value="form.files_path"
          placeholder="请填写图片文件夹"
        />
      </a-form-item>
      <a-form-item label="标签模板" name="label_id">
        <a-select
          mode="multiple"
          v-model:value="form.label_id"
          placeholder="请选择标签模板"
          @change="chooseLabel"
          :allowClear="true"
          v-show="!pid"
        >
          <a-select-option
            :value="item.id"
            v-for="(item, i) in templateList"
            :key="'la_' + i"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-row v-for="(tag, index) in form.labels" :key="'t_' + index">
          <a-col :span="6">
            <span>{{ tag.name }} {{tag.code?'['+tag.code+']':null}}</span>
          </a-col>
          <a-col :span="6">
            <!-- <span>{{ tag.color }}</span> -->
            <a-tag :color="tag.color">{{ tag.color }}</a-tag>
          </a-col>
          <a-col>
            <a-select
              v-model:value="tag.type"
              placeholder="请选择"
              :allowClear="true"
            >
              <a-select-option
                :value="label.id"
                v-for="(label, i) in labelType"
                :key="'lab_' + i"
                >{{ label.name }}</a-select-option
              >
            </a-select>
          </a-col>
        </a-row>
        <div></div>
      </a-form-item>
      <a-form-item label="抽检比例" name="qa_rate">
        <a-input
          class="w-1/2"
          v-model:value="form.qa_rate"
          placeholder="请填写1-100范围内的整数"
        />%
      </a-form-item>
      <a-form-item label="抽检段数" name="qa_segment">
        <a-input
          class="w-1/2"
          v-model:value="form.qa_segment"
          placeholder="请填写抽检段数"
        />
      </a-form-item>
      <a-form-item label="图片宽度" name="org_width">
        <a-input
          class="w-1/2"
          v-model:value="form.org_width"
          placeholder="请填写图片实际宽度"
        />m
      </a-form-item>
      <a-form-item label="图片高度" name="org_height">
        <a-input
          class="w-1/2"
          v-model:value="form.org_height"
          placeholder="请填写图片实际高度"
        />m
      </a-form-item>
      <a-form-item label="图片质量" name="image_quality">
        <a-input-number
          class="w-1/2" :min="1" :max="100"
          v-model:value="form.image_quality"
          placeholder="请填写1-100范围内的整数"
        />%
      </a-form-item>
      <a-form-item label="表格尺寸" name="grid_size">
        <a-input class="w-1/2" v-model:value="form.grid_size" placeholder="请填写表格尺寸"/>cm
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
