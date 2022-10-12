<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-03 11:38:33
 * @LastEditTime: 2022-10-12 18:01:50
 * @FilePath: /cvat-admin/src/components/road/List.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
const columns = [
  {
    title: "项目ID",
    dataIndex: "id",
  },
  {
    title: "路线名称",
    dataIndex: "name",
  },
  {
    title: "开始时间",
    dataIndex: "start_date",
  },
  {
    title: "结束时间",
    dataIndex: "end_date",
  },
  {
    title: "完成/总数",
    dataIndex: "complete_task_num",
    slots: { customRender: "complete_task_num" },
  },
  {
    title: "已标注图片数",
    dataIndex: "frame_worked"
  },
  {
    title: "图片总数",
    dataIndex: "frame_num"
  },
  {
    title: "任务桩号",
    dataIndex: "station_list",
    slots: { customRender: "station_list" },
  },
  {
    title: "状态",
    dataIndex: "status"
  },
  {
    title: "操作",
    dataIndex: "operate",
    slots: { customRender: "operate" },
  },
];
const selectedRowKeys = ref([]);
const res = ref([]);
const router = useRouter();
const pagination = ref({ pageSize: 10, current: 1, total: 0 });

function newRoad() {
  router.push({ name: "roadNew" });
}
function onSelectChange(selectedRowKeys) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
}

function edit(item) {
  // console.log("item: ", item, );
  router.push('edit/' + item.id);
}

function handleTableChange(page) {
  console.log("pagination: ", page );
  if (page && page.current) {
    pagination.value.current = page.current;
  }
  // debugger
  getList()
}
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects",
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

  promise.then((result) => {
    if (result) {
      res.value = result.results;
      pagination.value.total = result.count
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
      :data-source="res"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
    >
      <template #complete_task_num="{ record }">
        {{record.complete_task_num}} / {{record.all_task_num}}
      </template>
      <template #station_list="{ record }">
        {{record.station_list[0]?record.station_list[0]:'-'}} / {{record.station_list[1]?record.station_list[1]:'-'}}
      </template>
      <template #operate="{ record }">
        <a @click="edit(record)">编辑</a>
      </template>
    </a-table>
  </div>
</template>
