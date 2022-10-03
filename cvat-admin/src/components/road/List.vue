<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-03 11:38:33
 * @LastEditTime: 2022-10-03 12:28:36
 * @FilePath: /cvat-admin/src/components/road/List.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { TableProps, TableColumnType } from "ant-design-vue";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}
const columns = [
  {
    title: "项目ID",
    dataIndex: "name",
  },
  {
    title: "路线名称",
    dataIndex: "total_count",
  },
  {
    title: "开始时间",
    dataIndex: "average_daily_output",
  },
  {
    title: "结束时间",
    dataIndex: "project_process",
    slots: { customRender: "project_process" },
  },
  {
    title: "完成/总数",
    dataIndex: "average_daily_output",
  },
  {
    title: "状态",
    dataIndex: "construction_period",
    slots: { customRender: "construction_period" },
  },
  {
    title: "操作",
    dataIndex: "end_date",
  },
];
const selectedRowKeys = ref([]);
const homeData = {
  process: [{ id: 1 }, { id: 2 }],
};
function newRoad() {
  console.log("截止日期");
}
function onSelectChange(selectedRowKeys) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
};
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 200px">
        <a-page-header title="路线信息" sub-title="Road Manage" />
      </a-col>
      <a-col>
        <a-button type="primary" @click="newRoad"> 新建路线 </a-button>
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys.value,
        onChange: onSelectChange,
      }"
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
  </div>
</template>
