<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-15 11:16:35
 * @LastEditTime: 2023-01-05 23:44:13
 * @FilePath: /cvat-admin/src/components/road/TaskList.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, reactive,onBeforeUnmount } from "vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import handleMilesData from "../../utils/handleMiles.js";

const route = useRoute();

let categroyList = ref([]);
let timer = ref(0)
let categroyObj = ref({
  min:0,
  max:0,
});
const pid = route.params && route.params.id;
const projectInfo = JSON.parse(localStorage.projectInfo)
const pname = projectInfo.name
const filesPath = projectInfo.files_path
const projectTitle = "桩号列表" + (pname ? "-" + pname : "");
const statusType = {
  annotation: "标注",
  validation: "质检",
  completed: "完成",
};
const statusProgress = {
  Loading: "加载中...",
  Queued: "排队中",
  Started: "创建中",
  Finished: "已完成创建",
  Failed: "创建失败",
};
const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "任务名",
    dataIndex: "name",
  },
  // {
  //   title: "路线名",
  //   dataIndex: "project_name",
  // },
  // {
  //   title: "开始时间",
  //   dataIndex: "project_start_date",
  // },
  // {
  //   title: "结束时间",
  //   dataIndex: "project_end_date",
  // },
  {
    title: "识别人",
    dataIndex: "wk_assignee",
    slots: { customRender: "wk_assignee" },
  },
  {
    title: "核实人",
    dataIndex: "qa_assignee",
    slots: { customRender: "qa_assignee" },
  },
  // {
  //   title: "开始桩号",
  //   dataIndex: "start_station",
  // },
  // {
  //   title: "结束桩号",
  //   dataIndex: "end_station",
  // },
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
    title: "创建进度",
    dataIndex: "progressDesc"
  },
  {
    title: "状态",
    dataIndex: "status",
    slots: { customRender: "status" },
  },
  // {
  //   title: "job信息",
  //   dataIndex: "segments",
  // },
  {
    title: "已标注",
    dataIndex: "frame_worked",
  },
  {
    title: "总图数",
    dataIndex: "size",
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
const workerList = ref([]); // 识别人员
const qaList = ref([]); // 核实人员
const router = useRouter();
const pagination = ref({ pageSize: 10, current: 1, total: 0 });
const visible = ref<boolean>(false);
const editvisible = ref<boolean>(false);

function onSelectChange(selectedKeys: []) {
  // console.log("selectedRowKeys changed: ", selectedKeys);
  selectedRowKeys.value = selectedKeys;
}

function edit(item: { id: string }) {
  router.push("edit/" + item.id);
}

function handleTableChange(page: { current: number }) {
  if (page && page.current) {
    pagination.value.current = page.current;
  }
  // debugger
  getList();
}
function handleNumber (value){
  return parseFloat(value).toFixed(2) + '%'
}
function progress(item){
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/tasks/" + item.id + "/status",
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      if(result.state === 'Started'){
        message.warning('当前任务'+ item.name + '的创建状态为：'+statusProgress[result.state]+'进度是：'+handleNumber(result.progress)+'');
        item.progressDesc = statusProgress[result.state] + '('+handleNumber(result.progress)+')'
      }else {
        item.progressDesc = statusProgress[result.state]
        if(result.state !== 'Finished'){
          message.warning('当前任务'+ item.name + '的创建状态为：'+statusProgress[result.state]);
        }
      }
      // console.log(result);
    }
  });
  return promise
}
function getOrders(order: any[]){
  const getData = async (value) => {
    value.progressDesc = "查询中..."
    progress(value)
  }
  order.forEach((value) => {
    getData(value)
  })
}
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + pid + "/tasks",
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

  promise.then((result: any) =>{
    if (result) {
      if(result.results && result.results.length>0){
        getOrders(result.results)
      }
      res.value = result.results;
      pagination.value.total = result.count;
    }
  });
}
function getTagList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/users",
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      tagList.value = result.results;
      let worker: any[] = [] // 识别人员
      let qa = [] // 核实人员
      result.results.forEach((value, index, array) => {
        if(value.groups.includes("worker")){
          worker.push(value)
        }
        if(value.groups.includes("qa")){
          qa.push(value)
        }
      })
      workerList.value = [...worker];
      qaList.value = [...qa];
    }
  });
}
function cancel() {
  router.go(-1);
}

function initTask() {
  dynamicValidateForm.domains = []
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
  let len = dynamicValidateForm.domains.length
  const obj = JSON.parse(JSON.stringify(dynamicValidateForm.domains[len-1]))
  dynamicValidateForm.domains.push({
    id: undefined,
    name: "",
    start_station: obj.end_station, // +1
    end_station: "",
    wk_assignee_id: obj.wk_assignee_id,
    qa_assignee_id: obj.qa_assignee_id,
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
    item.name = pname + "_" +item.start_station + "~" + item.end_station;
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

function deleteClick(item){
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: import.meta.env.VITE_APP_BASE_URL + "api/tasks/" + item.id,
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    message.success('已删除桩号' + item.name);
    getList();
  });
}
function cancelDelete(e){
  console.log(e)
}
function editClick(item: { id: any; name: any; start_station: any; end_station: any; wk_assignee: { id: any; }; qa_assignee: { id: any; }; }){
  editvisible.value = true;
  dynamicValidateForm.domains = []
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
function handlEditeOk(){
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

function getCatalogue() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/server/share",
      params: { directory: filesPath, range: 1 },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      categroyList.value = result
      categroyObj.value.min = result[0]
      categroyObj.value.max = result[result.length-1]
      console.log(categroyObj.value)
    }
  });
}

onMounted(() => {
  getList();
  getTagList();
  getCatalogue()
  timer.value = setInterval(() => {
    getOrders(res.value)
  }, 10000);
});

onBeforeUnmount(()=>{
  clearInterval(timer.value)
  timer.value = 0
});
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 300px">
        <a-page-header :title="projectTitle" @back="cancel" />
      </a-col>
      <a-col>
        <a-button type="primary" danger @click="newStation" class="mt-1"> 新建桩号 </a-button>
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
      <template #status="{ record }">
          {{ statusType[record.status] }}
        </template>
      <template #wk_assignee="{ record }">
        {{ record.wk_assignee && record.wk_assignee.username }}
      </template>
      <template #qa_assignee="{ record }">
        {{ record.qa_assignee && record.qa_assignee.username }}
      </template>
      <template #operate="{ record }">
        <a @click="progress(record)">
          <a-tag color="#1890ff"><EditOutlined /> 查看进度</a-tag>
        </a>
        <a @click="editClick(record)">
          <a-tag color="#1890ff"><EditOutlined /> 编辑</a-tag>
        </a>
        <a-popconfirm
          title="确认删除该桩号吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteClick(record)"
          @cancel="cancelDelete"
        >
          <a-tag color="#1890ff"><EditOutlined /> 删除</a-tag>
        </a-popconfirm>
      </template>
      <!-- <template #complete_task_num="{ record }">
        {{record.complete_task_num}} / {{record.all_task_num}}
      </template>
      <template #station_list="{ record }">
        {{record.station_list[0]?record.station_list[0]:'-'}} / {{record.end_station?record.end_station:'-'}}
      </template>
       -->
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
          v-bind="formItemLayout"
          :label="'桩号范围'"
          :name="['domains', index, 'value']"
        >
          <a-tag color="orange">{{handleMilesData(categroyObj.min)}}~{{handleMilesData(categroyObj.max)}}</a-tag>
        </a-form-item>
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
              v-for="(item, i) in workerList"
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
              v-for="(item, i) in qaList"
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
              v-for="(item, i) in workerList"
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
              v-for="(item, i) in qaList"
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
