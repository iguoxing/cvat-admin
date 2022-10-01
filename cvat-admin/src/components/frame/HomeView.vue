<!--
 * @Author: ArdenZhao
 * @Date: 2022-09-29 17:20:07
 * @LastEditTime: 2022-10-02 07:54:09
 * @FilePath: /cvat-admin/src/components/frame/HomeView.vue
 * @Description: file information
-->
<script setup lang="ts">
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
    title: "项目名",
    dataIndex: "name",
  },
  {
    title: "总量（张）",
    dataIndex: "total_count",
  },
  {
    title: "日均产能（张）",
    dataIndex: "average_daily_output",
  },
  {
    title: "进度",
    dataIndex: "project_process",
    slots: { customRender: "project_process" },
  },
  {
    title: "工期",
    dataIndex: "construction_period",
    slots: { customRender: "construction_period" },
  },
  {
    title: "截止日期",
    dataIndex: "end_date",
  },
];
const homeData = {
  process: [{ id: 1 }],
};
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
        :row-key="(record) => 'row' + homeData.process.id"
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
