<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-03 11:38:33
 * @LastEditTime: 2022-10-05 20:47:29
 * @FilePath: /cvat-admin/src/components/road/List.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";

const columns = [
  {
    title: "项目ID",
    dataIndex: "id",
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
const res = ref([]);
function newRoad() {
  console.log("截止日期");
}
function onSelectChange(selectedRowKeys) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
};
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
      console.log("截止日期", res.value);
    }
  });
};
onMounted(() => {
  console.log(123);
  getList()
});

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
      :row-key="(record) => 'row' + record.id"
      :data-source="res.value"
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
