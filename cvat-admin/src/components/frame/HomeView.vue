<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-29 17:20:07
 * @LastEditTime: 2022-10-27 17:27:57
 * @FilePath: /cvat-admin/src/components/frame/HomeView.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";

const headStyle = {
  "font-weight": 600,
  color: "#333",
  background: "#f5f5f5",
};
const cardStyle = {
  "padding-right": "20px",
};
const bg1Style = {background: "#f3ada180",};
const bg2Style = {background: "#4fe44e4f",};
const bg3Style = {background: "#e3e44e5c",};
const bg4Style = {background: "#4ee4d845",};
const columns = [
  {
    title: "路线",
    dataIndex: "project_name",
  },
  {
    title: "起点桩号",
    dataIndex: "start_station",
  },
  {
    title: "终点桩号",
    dataIndex: "end_station",
  },
  {
    title: "里程数",
    dataIndex: "mileage",
  },
  {
    title: "标注员",
    dataIndex: "wk_assignee",
    slots: { customRender: "wk_assignee" },
  },
  {
    title: "质检员",
    dataIndex: "qa_assignee",
    slots: { customRender: "qa_assignee" },
  },
  {
    title: "里程",
    dataIndex: "mileage",
  },
  {
    title: "任务状态",
    dataIndex: "task_status",
  },
  // {
  //   title: "截止日期",
  //   dataIndex: "end_date",
  // },
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
    dataIndex: "project_name",
  },
  {
    title: "桩号",
    dataIndex: "total_count",
  },
  {
    title: "起点桩号",
    dataIndex: "start_station",
  },
  {
    title: "终点桩号",
    dataIndex: "end_station",
  },
  {
    title: "里程数",
    dataIndex: "mileage",
  },
  {
    title: "标注员",
    dataIndex: "wk_assignee.username",
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
      res.value = result;
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
    <a-row>
      <a-col :span="24">
        <a-row :gutter="24">
          <a-col :span="6">
            <!-- title="路线"  -->
            <a-card :headStyle="headStyle" :bodyStyle="bg1Style">
              <a-statistic title="全部路线" :value="res.projects_total || 0" class="bg-opacity-25"/>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg3Style">
              <a-statistic title="已完成路线" :value="res.projects_complete || 0" :value-style="{ color: '#3f8600' }"/>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg2Style">
              <a-statistic title="全部里程" :value="res.mileage_total || 0"/>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card :headStyle="headStyle" :bodyStyle="bg4Style">
              <a-statistic title="已完成里程" :value="res.mileage_complete || 0" :value-style="{ color: '#3f8600' }"/>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <!-- <a-col :span="2"></a-col> -->
      <!-- <a-col :span="12">
        <a-card title="里程" :headStyle="headStyle" size="small">
          <a-row>
            <a-col :span="12">
              <a-statistic title="全部里程" :value="res.mileage_total || 0" />
            </a-col>
            <a-col :span="12">
              <a-statistic title="已完成里程" :value="res.mileage_complete || 0" />
            </a-col>
          </a-row>
        </a-card>
      </a-col> -->
    </a-row>
    <a-card title="路线信息" class="mt-3" :headStyle="headStyle" size="small">
      <a-table
        :columns="columns"
        :data-source="res.res"
        :pagination="false"
        :bordered="true"
      >
        <template #wk_assignee="{ record }">
          <div>
            <a-tag color="green">{{record.wk_assignee.username}}</a-tag>
          </div>
        </template>
        <template #qa_assignee="{ record }">
          <div>
            <a-tag color="blue">{{record.qa_assignee.username}}</a-tag>
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
    <!-- <a-card title="桩号信息" class="mt-3" :headStyle="headStyle" size="small">
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
    </a-card> -->
    <!-- <a-card title="标注统计信息" class="mt-3" :headStyle="headStyle" size="small">
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
    </a-card> -->
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
