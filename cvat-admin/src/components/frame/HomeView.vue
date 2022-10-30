<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-29 17:20:07
 * @LastEditTime: 2022-10-30 16:33:40
 * @FilePath: /cvat-admin/src/components/frame/HomeView.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import PieChart from "../charts/PieChart.vue";
import dayjs from "dayjs";

const headStyle = {
  "font-weight": 600,
  color: "#333",
  background: "#f5f5f5",
};
const cardStyle = {
  "padding-right": "20px",
};
const bg1Style = { background: "#f3ada180" };
const bg2Style = { background: "#4fe44e4f" };
const bg3Style = { background: "#e3e44e5c" };
const bg4Style = { background: "#4ee4d845" };
const columns = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "开始/结束时间",
    dataIndex: "start_date",
    slots: { customRender: "start_date" },
  },
  {
    title: "完成/总数",
    dataIndex: "complete_task_num",
    slots: { customRender: "complete_task_num" },
  },
  {
    title: "已标/总数",
    dataIndex: "frame_worked",
    slots: { customRender: "frame_worked" },
  },
  {
    title: "桩号",
    dataIndex: "station_list",
    slots: { customRender: "station_list" },
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "操作",
    dataIndex: "operate",
    slots: { customRender: "operate" },
  },
];

const stationColumns = [
  {
    title: "任务名",
    dataIndex: "name",
  },
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
  {
    title: "更新时间",
    dataIndex: "updated_date",
    slots: { customRender: "updated_date" },
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "已标注",
    dataIndex: "frame_worked",
  },
  {
    title: "总图数",
    dataIndex: "size",
  },
];

const homeData = {
  process: [{ id: 1 }],
};

const res = ref([]);
const road = ref([]);
const task = ref([]);
let isTask = ref(false);
let chartList = ref([]);
let projectName = ref('');

function getData(pid) {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/stat_2/",
      params: {
        project_id: pid ? pid : 0,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      res.value = result;
      chartList.value = isTask.value ? result.proj_stat : result.all_stat;
      // console.log('result.all_stat', result.all_stat);
    } else {
      chartList.value = [];
    }
  });
}

function getList() {
  getData(0);

  const promise2 = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects",
      params: {
        page: 1,
        page_size: 1000,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise2.then((result: any) => {
    if (result) {
      road.value = result.results;
    }
  });
}

function getTask(item) {
  isTask.value = true;
  projectName.value = '任务统计-' + item.name
  getData(item.id);
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + item.id + "/tasks",
      params: {
        page: 1,
        page_size: 1000,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      task.value = result.results;
    }
  });
}

function goToHome(){
  isTask.value = false;
  getData(0);
}

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="greetings">
    <a-page-header title="主页" v-show="!isTask"/>
    <a-page-header :title="projectName" @back="goToHome" v-show="isTask"/>
    <a-row>
      <a-col :span="24">
        <a-row :gutter="24">
          <a-col :span="6">
            <!-- title="路线"  -->
            <a-card :headStyle="headStyle" :bodyStyle="bg1Style">
              <a-statistic
                title="全部路线"
                :value="res.projects_total || 0"
                class="bg-opacity-25"
              />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg3Style">
              <a-statistic
                title="已完成路线"
                :value="res.projects_complete || 0"
                :value-style="{ color: '#3f8600' }"
              />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg2Style">
              <a-statistic title="全部里程" :value="res.mileage_total || 0" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg4Style">
              <a-statistic
                title="已完成里程"
                :value="res.mileage_complete || 0"
                :value-style="{ color: '#3f8600' }"
              />
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-card
      title="路线信息"
      class="mt-3"
      :headStyle="headStyle"
      size="small"
      v-show="!isTask"
    >
      <a-table
        :columns="columns"
        :data-source="road"
        :pagination="false"
        :bordered="true"
      >
        <template #complete_task_num="{ record }">
          {{ record.complete_task_num }} / {{ record.all_task_num }}
        </template>
        <template #start_date="{ record }">
          {{ record.start_date ? record.start_date : "-" }} ~
          {{ record.end_date ? record.end_date : "-" }}
        </template>
        <template #frame_worked="{ record }">
          {{ record.frame_worked ? record.frame_worked : "-" }} /
          {{ record.frame_num ? record.frame_num : "-" }}
        </template>

        <template #station_list="{ record }">
          {{ record.station_list[0] ? record.station_list[0] : "-" }} -
          {{ record.station_list[1] ? record.station_list[1] : "-" }}
        </template>
        <template #project_process="{ record }">
          <a-progress :percent="record.project_process" />
        </template>
        <template #operate="{ record }">
          <a @click="getTask(record)">
            <a-tag color="cyan">桩号统计</a-tag>
          </a>
        </template>
        <template #construction_period="{ record }">
          <span
            v-if="record.construction_period > record.project_process"
            class="flex"
          >
            <a-progress
              :percent="record.construction_period"
              strokeColor="red"
              :showInfo="false"
            />
            {{ record.construction_period }}%
          </span>
          <span v-if="record.construction_period <= record.project_process">
            <a-progress :percent="record.construction_period" />
          </span>
        </template>
      </a-table>
    </a-card>
    <a-card
      title="桩号信息"
      class="mt-3"
      :headStyle="headStyle"
      size="small"
      v-show="isTask"
    >
      <a-table
        :columns="stationColumns"
        :data-source="task"
        :pagination="false"
        :bordered="true"
      >
      <template #updated_date="{ record }">
        {{ dayjs(record.updated_date).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #wk_assignee="{ record }">
        {{ record.wk_assignee && record.wk_assignee.username }}
      </template>
      <template #qa_assignee="{ record }">
        {{ record.qa_assignee && record.qa_assignee.username }}
      </template>
      </a-table>
    </a-card>
    <a-row :gutter="24" class="m-8">
      <a-col  v-for="(chartData, index) in chartList"
        :key="`chart${chartData.template_id}`"
        class="chart-container">
        <PieChart
        :title="chartData.template_name"
        :chartData="chartData.items.map(d => ({value: d.used_times, name: d.label_name}))"
        />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
