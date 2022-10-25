<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-29 17:20:07
 * @LastEditTime: 2022-10-21 11:39:12
 * @FilePath: /cvat-admin/src/components/frame/HomeView.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import PieChart from "../charts/PieChart.vue";

const headStyle = {
  "font-weight": 600,
  color: "#333",
  background: "#f5f5f5",
};
const cardStyle = {
  "padding-right": "20px",
};
const columns = [
  {
    title: "路线名称",
    dataIndex: "name",
  },
  {
    title: "起点桩号",
    dataIndex: "total_count",
  },
  {
    title: "终点桩号",
    dataIndex: "average_daily_output",
  },
  {
    title: "里程（终点-起点）",
    dataIndex: "project_process",
    slots: { customRender: "project_process" },
  },
  {
    title: "总张数",
    dataIndex: "average_daily_output",
  },
  {
    title: "标注进度（标注完成的图片/总图片）",
    dataIndex: "construction_period",
    slots: { customRender: "construction_period" },
  },
  {
    title: "是否验收（已验收/未验收）",
    dataIndex: "end_date",
  },
  {
    title: "截止日期",
    dataIndex: "end_date",
  },
];

const stationColumns = [
  {
    title: "桩号名称",
    dataIndex: "name",
  },
  {
    title: "起点桩号",
    dataIndex: "total_count",
  },
  {
    title: "终点桩号",
    dataIndex: "average_daily_output",
  },
  {
    title: "里程（终点-起点）",
    dataIndex: "project_process",
    slots: { customRender: "project_process" },
  },
  {
    title: "总张数",
    dataIndex: "average_daily_output",
  },
  {
    title: "标注进度（标注完成的图片/总图片）",
    dataIndex: "construction_period",
    slots: { customRender: "construction_period" },
  },
  {
    title: "是否验收（已验收/未验收）",
    dataIndex: "end_date",
  },
  {
    title: "截止日期",
    dataIndex: "end_date",
  },
];

const tagColumns = [
  {
    title: "路线",
    dataIndex: "name",
  },
  {
    title: "桩号",
    dataIndex: "total_count",
  },
  {
    title: "起点桩号",
    dataIndex: "average_daily_output",
  },
  {
    title: "终点桩号",
    dataIndex: "project_process",
    slots: { customRender: "project_process" },
  },
  {
    title: "里程数",
    dataIndex: "average_daily_output",
  },
  {
    title: "标注员",
    dataIndex: "construction_period",
    slots: { customRender: "construction_period" },
  },
  {
    title: "审核员",
    dataIndex: "end_date",
  },
  {
    title: "创建人",
    dataIndex: "end_date",
  },
  {
    title: "损坏类型",
    dataIndex: "end_date",
  },
  {
    title: "矩形",
    dataIndex: "end_date",
  },
  {
    title: "曲线",
    dataIndex: "end_date",
  },
  {
    title: "椭圆",
    dataIndex: "end_date",
  },
];
const homeData = {
  process: [{ id: 1 }],
};

const res = ref([]);

function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/stat_2/",
      // params: {
      //   project_id: 63,
      // },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
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
  <div class="greetings">
    <a-row class="text-left ant-search">
      <a-col :span="12" :style="cardStyle">
        <!-- <a-card title="项目"> -->
        <a-card title="路线" :headStyle="headStyle" size="small">
          <a-row>
            <a-col :span="12">
              <a-statistic title="全部路线" :value="123" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="已完成路线" :value="123" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <!-- <a-col :span="2"></a-col> -->
      <a-col :span="12">
        <a-card title="里程" :headStyle="headStyle" size="small">
          <a-row>
            <a-col :span="12">
              <a-statistic title="全部里程" :value="123" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="已完成里程" :value="123" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-card title="路线信息" class="mt-3" :headStyle="headStyle" size="small">
      <a-table
        :columns="columns"
        :data-source="homeData.process"
        :pagination="false"
        :bordered="true"
      >
        <template #status="{ record }">
          <div>
            <a-tag color="green" v-if="record.status == 0">正常</a-tag>
          </div>
        </template>
        <template #project_process="{ record }">
          <a-progress :percent="record.project_process" />
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
    <a-card title="桩号信息" class="mt-3" :headStyle="headStyle" size="small">
      <a-table
        :columns="stationColumns"
        :data-source="homeData.process"
        :pagination="false"
        :bordered="true"
      >
        <template #status="{ record }">
          <div>
            <a-tag color="green" v-if="record.status == 0">正常</a-tag>
          </div>
        </template>
        <template #project_process="{ record }">
          <a-progress :percent="record.project_process" />
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
    <a-card title="标注统计信息" class="mt-3" :headStyle="headStyle" size="small">
      <a-table
        :columns="tagColumns"
        :data-source="homeData.process"
        :pagination="false"
        :bordered="true"
      >
        <template #status="{ record }">
          <div>
            <a-tag color="green" v-if="record.status == 0">正常</a-tag>
          </div>
        </template>
        <template #project_process="{ record }">
          <a-progress :percent="record.project_process" />
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
    <PieChart />
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
