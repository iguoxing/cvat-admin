<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import dayjs from 'dayjs';

const columns = [
  {
    title: "人员ID",
    dataIndex: "id",
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "加入时间",
    dataIndex: "date_joined",
    slots: { title: 'dateJoined', customRender: 'dateJoined' },
  },
  {
    title: "状态",
    dataIndex: "is_active",
    slots: { customRender: 'activeStatus' },
  },
  {
    title: "权限",
    dataIndex: "groups",
    slots: { customRender: 'tags' },
  },
];
const selectedRowKeys = ref([]);
const res = ref([]);
function newRoad() {
  console.log("newRoad");
}
function onSelectChange(selectedRowKeys) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
};
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "/api/users",
      params: {
        // page: 1,
        // page_size: 10,
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
      console.log(res.value);
    }
  });
};
onMounted(() => {
  getList()
});

</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 200px">
        <a-page-header title="人员管理" sub-title="Person Manage" />
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
      :data-source="res"
      :pagination="false"
      :bordered="true"
    >
      <template #dateJoined="{ text }">
        <span>
          {{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}}
        </span>
      </template>
      <template #activeStatus="{ text }">
        <span>
          {{text ? '已激活' : '未激活'}}
        </span>
      </template>
      <template #complete_task_num="{ record }">
        {{record.complete_task_num}} / {{record.all_task_num}}
      </template>
    </a-table>
  </div>
</template>
