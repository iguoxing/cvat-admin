<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-17 18:27:47
 * @LastEditTime: 2023-01-10 19:15:08
 * @FilePath: /cvat-admin/src/components/template/List.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

const route = useRoute();

const pid = route.params && route.params.id;
const labelType = {
  // bbox: "矩形",
  rectangle: "矩形",
  ellipse: "椭圆",
  polyline: "曲线",
  tag: "标签",
};
const labelTypeArr = ref([
  { id: "rectangle", name: "矩形" },
  // { id: "bbox", name: "矩形" },
  { id: "ellipse", name: "椭圆" },
  { id: "polyline", name: "曲线" },
  { id: "tag", name: "标签" },
]);
const columns = [
  // {
  //   title: "模板ID",
  //   dataIndex: "id",
  // },
  {
    title: "模板名称",
    dataIndex: "name",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "labels",
    slots: { customRender: "labels" },
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "created_date",
  //   slots: { customRender: "created_date" },
  // },
  {
    title: "更新时间",
    dataIndex: "updated_date",
    slots: { customRender: "updated_date" },
  },
  {
    title: "操作",
    dataIndex: "operate",
    slots: { customRender: "operate" },
  },
];
let selectedRowKeys = ref([]);
const res = ref([]);
const tagList = ref([]);
const router = useRouter();
const pagination = ref({ pageSize: 10, current: 1, total: 0 });
const visible = ref<boolean>(false);
const editvisible = ref<boolean>(false);

function onSelectChange(selectedKeys: []) {
  console.log("selectedRowKeys changed: ", selectedKeys);
  selectedRowKeys.value = selectedKeys;
}

function edit(item: { id: string }) {
  // console.log("item: ", item, );
  router.push("edit/" + item.id);
}

function handleTableChange(page: { current: number }) {
  console.log("pagination: ", page);
  if (page && page.current) {
    pagination.value.current = page.current;
  }
  // debugger
  getList();
}
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/templates",
      params: {
        page: pagination.value.current || 1,
        page_size: pagination.value.pageSize || 10,
        // filter: JSON.stringify(['name', 'owner', 'assignee', 'status', 'id', 'updated_date','start_date','end_date']),
        // search: 'name'
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      res.value = result.results;
      pagination.value.total = result.count;
      console.log(res.value);
    }
  });
}
let isEdit = false;
let tid: string = ""

function initTask() {
  isEdit = false
  preForm.value.name = "";
  preForm.value.content = "";

  dynamicValidateForm.labels = []
  dynamicValidateForm.labels.push({
    id: undefined,
    name: "",
    code: "",
    color: "#333",
    type: "rectangle",
    attributes: [],
    deleted: undefined,
  });
}
function newStation() {
  visible.value = true;
  initTask();
}
function add() {
  console.log("add");
}

const formRef = ref<FormInstance>();
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
const inputStyle = "width: 120px; margin-right: 8px";
interface Domain {
  id: number | undefined;
  name: string;
  code: string,
  color: string;
  type: string;
  attributes: [];
  deleted: boolean | undefined;
}

let preForm = ref({
  name: "",
  content: "",
});

let dynamicValidateForm = reactive<{
  labels: Domain[];
}>({
  labels: [
    {
      id: undefined,
      name: "",
      code: "",
      color: "#333",
      type: "rectangle",
      attributes: [],
      deleted: undefined,
    },
  ],
});

const addDomain = () => {
  dynamicValidateForm.labels.push({
    id: undefined,
    name: "",
    code: "",
    color: "#333",
    type: "rectangle",
    attributes: [],
    deleted: undefined,
  });
  console.log(preForm);
  console.log(dynamicValidateForm);
  // debugger;
};
let options = [...Array(25)].map((_, i) => ({ value: i + 1 }));
const removeDomain = (item: Domain) => {
  item.deleted = true //设置为删除
  // let index = dynamicValidateForm.labels.indexOf(item);
  // if (index !== -1) {
  //   dynamicValidateForm.labels.splice(index, 1);
  // }
};
function addTag(labels){
  visible.value = false;
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: import.meta.env.VITE_APP_BASE_URL + "api/templates",
      data: {
        name: preForm.value.name,
        content: preForm.value.content,
        labels: labels,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      getList();
    }
  });
}
function editTag(labels){
  visible.value = false;
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: import.meta.env.VITE_APP_BASE_URL + "api/templates/" + tid,
      data: {
        name: preForm.value.name,
        content: preForm.value.content,
        labels: labels,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      getList();
    }
  });
}
const handleOk = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log("values", dynamicValidateForm.labels);
    })
    .catch((error) => {
      console.log("error", error);
    });
  if (!isEdit) {
    addTag(dynamicValidateForm.labels);
  } else {
    editTag(dynamicValidateForm.labels);
  }
};
function editClick(item) {
  isEdit = true
  tid = item.id
  visible.value = true;
  // editvisible.value = true;
  preForm.value.name = item.name;
  preForm.value.content = item.content;
  dynamicValidateForm.labels = []
  item.labels.forEach((item: any) => {
    dynamicValidateForm.labels.push({
      id: item.id,
      name: item.name,
      code: item.code,
      color: item.color,
      attributes: item.attributes,
      type: item.type,
      deleted: undefined,
    });
  });
}
function deleteItem(item){
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: import.meta.env.VITE_APP_BASE_URL + "api/templates/" + item.id,
    }).then(function (data) {
      resolve(data);
    });
  });

  promise.then((result: any) => {
    getList();
  });
}

function cancelDelete(e){
  console.log(e)
}

onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 300px">
        <a-page-header title="标签模板" />
        <!-- <a-page-header title="标签模板" sub-title="Tag Template" /> -->
      </a-col>
      <a-col>
        <a-button type="primary" @click="newStation"> 新建模板 </a-button>
      </a-col>
    </a-row>
    <!-- :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }" -->
    <a-table
      :columns="columns"
      :data-source="res"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
    >
      <template #created_date="{ record }">
        {{ dayjs(record.created_date).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updated_date="{ record }">
        {{ dayjs(record.updated_date).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #labels="{ record }">
        <a-row v-for="(tag, index) in record.labels" :key="'l_' + index">
          <a-col :span="8">{{ tag.name }}{{ tag.code?'['+tag.code+']':null }}</a-col>
          <a-col :span="8"><a-tag :color="tag.color">{{ tag.color }}</a-tag></a-col>
          <a-col :span="6">
            【{{labelType[tag.type]}}】
          </a-col>
        </a-row>
      </template>
      <template #qa_assignee="{ record }">
        {{ record.qa_assignee && record.qa_assignee.username }}
      </template>
      <template #operate="{ record }">
        <a @click="editClick(record)" class="mr-3">
          <a-tag color="#1890ff"><EditOutlined /> 编辑</a-tag>
        </a>
        <!-- <a-divider type="vertical" /> -->
        <a-popconfirm
          title="确认删除该标签模板吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteItem(record)"
          @cancel="cancelDelete"
        >
          <a-tag color="#1890ff"><DeleteOutlined /> 删除</a-tag>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="维护模板"
      width="880px"
      @ok="handleOk"
    >
      <a-form
        ref="formRef"
        name="dynamic_form_item"
        v-bind="formItemLayoutWithOutLabel"
      >
        <a-form-item
          ref="name"
          label="名称"
          name="name"
          v-bind="formItemLayout"
        >
          <a-input
            v-model:value="preForm.name"
            placeholder="请填写名称"
            class="w-1/2"
          />
        </a-form-item>
        <a-form-item
          ref="content"
          label="描述"
          name="content"
          v-bind="formItemLayout"
        >
          <a-input
            v-model:value="preForm.content"
            placeholder="请填写描述"
            class="w-1/2"
          />
        </a-form-item>
        <a-form-item
          v-for="(domain, index) in dynamicValidateForm.labels"
          :key="'do_' + index"
          v-bind="formItemLayout"
          :label="'标签名称'"
          :name="['labels', index, 'value']"
          v-show="!domain.deleted"
        >
          <!-- <span>: </span> -->
          <a-input
            v-model:value="domain.name"
            placeholder="输入名称"
            :style="inputStyle"
          />
          <span>损坏编码: </span>
          <a-input
            v-model:value="domain.code"
            placeholder="输入编码"
            :style="inputStyle"
          />
          <span>颜色: </span>
          <a-input
            v-model:value="domain.color"
            type="color"
            placeholder="选择颜色"
            :style="inputStyle"
          />
          <span>类型: </span>
          <a-select
            v-model:value="domain.type"
            placeholder="请选择"
            :allowClear="true"
            :style="inputStyle"
          >
            <a-select-option
              :value="label.id"
              v-for="(label, i) in labelTypeArr"
              :key="'lab_' + i"
              >{{ label.name }}</a-select-option
            >
          </a-select>
          <MinusCircleOutlined
            v-if="dynamicValidateForm.labels.length > 1"
            class="dynamic-delete-button"
            :disabled="dynamicValidateForm.labels.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="addDomain">
            <PlusOutlined />
            添加标签
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
