<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-17 18:27:47
 * @LastEditTime: 2022-10-17 18:54:56
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

const route = useRoute();

const pid = route.params && route.params.id;
let labelType = {
  bbox: "矩形",
  ellipse: "椭圆",
  polyine: "多边形",
  tag: "标签",
};
const columns = [
  {
    title: "模板ID",
    dataIndex: "id",
  },
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

function initTask() {
  dynamicValidateForm.domains = [];
  dynamicValidateForm.domains.push({
    id: undefined,
    name: "",
    start_station: "",
    end_station: "",
    wk_assignee_id: null,
    qa_assignee_id: null,
    labels: [],
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
  start_station: string;
  end_station: string;
  wk_assignee_id: number | null;
  qa_assignee_id: number | null;
  labels: [];
}
let dynamicValidateForm = reactive<{ domains: Domain[] }>({
  domains: [
    {
      id: undefined,
      name: "",
      start_station: "",
      end_station: "",
      wk_assignee_id: null,
      qa_assignee_id: null,
      labels: [],
    },
  ],
});

let editForm = ref({
  name: "",
  start_station: "",
  end_station: "",
  wk_assignee_id: null,
  qa_assignee_id: null,
  labels: [],
});

const addDomain = () => {
  dynamicValidateForm.domains.push({
    id: undefined,
    name: "",
    start_station: "",
    end_station: "",
    wk_assignee_id: null,
    qa_assignee_id: null,
    labels: [],
  });
};
let options = [...Array(25)].map((_, i) => ({ value: i + 1 }));
const removeDomain = (item: Domain) => {
  let index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};
const handleOk = () => {
  visible.value = false;
  dynamicValidateForm.domains.forEach((item) => {
    item.name = item.start_station + "~" + item.end_station;
  });
  formRef.value
    .validate()
    .then(() => {
      console.log("values", dynamicValidateForm.domains);
    })
    .catch((error) => {
      console.log("error", error);
    });
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid,
      data: {
        tasks: dynamicValidateForm.domains,
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
};
function editClick(item: {
  id: any;
  name: any;
  start_station: any;
  end_station: any;
  wk_assignee: { id: any };
  qa_assignee: { id: any };
}) {
  editvisible.value = true;
  dynamicValidateForm.domains = [];
  dynamicValidateForm.domains.push({
    id: item.id,
    name: item.name,
    start_station: item.start_station,
    end_station: item.end_station,
    wk_assignee_id: item.wk_assignee && item.wk_assignee.id,
    qa_assignee_id: item.qa_assignee && item.qa_assignee.id,
    labels: [],
  });
}
function handlEditeOk() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid,
      data: {
        id: pid,
        tasks: dynamicValidateForm.domains,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      editvisible.value = false;
      getList();
    }
  });
}
onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 300px">
        <a-page-header title="标签模板" sub-title="Tag Template" />
      </a-col>
      <a-col>
        <!-- <a-button type="primary" @click="newStation"> 新建模板 </a-button> -->
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
          {{ tag.name }} 【{{ tag.color }}】<a-tag :color="tag.color">{{
            tag.color
          }}</a-tag>
          【{{ labelType[tag.type] }}】
        </a-row>
      </template>
      <template #qa_assignee="{ record }">
        {{ record.qa_assignee && record.qa_assignee.username }}
      </template>
      <template #operate="{ record }">
        <!-- <a @click="editClick(record)">编辑</a> -->
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="维护桩号"
      width="1000px"
      @ok="handleOk"
    >
      <a-form
        ref="formRef"
        name="dynamic_form_item"
        :model="dynamicValidateForm"
        v-bind="formItemLayoutWithOutLabel"
      >
        <a-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="'d' + index"
          v-bind="formItemLayout"
          :label="'开始桩号'"
          :name="['domains', index, 'value']"
        >
          <a-input
            v-model:value="domain.start_station"
            placeholder="输入开始桩号"
            :style="inputStyle"
          />
          <span>结束桩号: </span>
          <a-input
            v-model:value="domain.end_station"
            placeholder="输入结束桩号"
            :style="inputStyle"
          />
          <span>识别人员: </span>
          <a-select
            v-model:value="domain.wk_assignee_id"
            placeholder="请选择"
            :allowClear="true"
            :style="inputStyle"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, i) in tagList"
              :key="'wk' + i"
              >{{ item.username }}</a-select-option
            >
          </a-select>
          <span>核实人员: </span>
          <a-select
            v-model:value="domain.qa_assignee_id"
            placeholder="请选择"
            :allowClear="true"
            :style="inputStyle"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, i) in tagList"
              :key="'qa' + i"
              >{{ item.username }}</a-select-option
            >
          </a-select>
          <MinusCircleOutlined
            v-if="dynamicValidateForm.domains.length > 1"
            class="dynamic-delete-button"
            :disabled="dynamicValidateForm.domains.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="addDomain">
            <PlusOutlined />
            添加桩号
          </a-button>
        </a-form-item>
        <!-- <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="primary" html-type="submit" @click="submitForm"
            >Submit</a-button
          >
        </a-form-item> -->
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="editvisible"
      title="维护桩号"
      width="1000px"
      @ok="handlEditeOk"
    >
      <a-form
        ref="formRef"
        name="dynamic_form_item"
        :model="dynamicValidateForm"
        v-bind="formItemLayoutWithOutLabel"
      >
        <a-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="'do' + index"
          v-bind="formItemLayout"
          :label="'开始桩号'"
          :name="['domains', index, 'value']"
        >
          <a-input
            v-model:value="domain.start_station"
            placeholder="输入开始桩号"
            :disabled="true"
            :style="inputStyle"
          />
          <span>结束桩号: </span>
          <a-input
            v-model:value="domain.end_station"
            :disabled="true"
            placeholder="输入结束桩号"
            :style="inputStyle"
          />
          <span>识别人员: </span>
          <a-select
            v-model:value="domain.wk_assignee_id"
            placeholder="请选择"
            :allowClear="true"
            :style="inputStyle"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, i) in tagList"
              :key="'wk' + i"
              >{{ item.username }}</a-select-option
            >
          </a-select>
          <span>核实人员: </span>
          <a-select
            v-model:value="domain.qa_assignee_id"
            placeholder="请选择"
            :allowClear="true"
            :style="inputStyle"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, i) in tagList"
              :key="'qa' + i"
              >{{ item.username }}</a-select-option
            >
          </a-select>
          <MinusCircleOutlined
            v-if="dynamicValidateForm.domains.length > 1"
            class="dynamic-delete-button"
            :disabled="dynamicValidateForm.domains.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <!-- <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="primary" html-type="submit" @click="submitForm"
            >Submit</a-button
          >
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
