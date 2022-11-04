<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-13 10:44:00
 * @LastEditTime: 2022-11-04 18:38:05
 * @FilePath: /cvat-admin/src/components/task/List.vue
 * @Description: file information
-->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";

const statusType = {
  annotation: "标注",
  validation: "质检",
  completed: "完成",
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
  {
    title: "路线名",
    dataIndex: "project_name",
  },
  {
    title: "开始/结束时间",
    dataIndex: "project_start_date",
    slots: { customRender: "project_start_date" },
  },
  // {
  //   title: "结束时间",
  //   dataIndex: "project_end_date",
  // },
  // {
  //   title: "标注人员",
  //   dataIndex: "wk_assignee",
  // },
  // {
  //   title: "质检人员",
  //   dataIndex: "qa_assignee",
  // },
  {
    title: "起止桩号",
    dataIndex: "start_station",
    slots: { customRender: "start_station" },
  },
  // {
  //   title: "结束桩号",
  //   dataIndex: "end_station",
  // },
  {
    title: "创建时间",
    dataIndex: "created_date",
    slots: { customRender: "created_date" },
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
  // {
  //   title: "操作",
  //   dataIndex: "operate",
  //   slots: { customRender: "operate" },
  // },
];
let selectedRowKeys = ref([]);
const res = ref([]);
const router = useRouter();
const pagination = ref({ pageSize: 10, current: 1, total: 0 });

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
      url: import.meta.env.VITE_APP_BASE_URL + "api/tasks",
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
onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col>
        <a-page-header title="桩号管理" ß/>
        <!-- <a-page-header title="桩号管理" sub-title="Station Manage" /> -->
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
      <template #project_start_date="{ record }">
        {{ record.project_start_date }}~{{ record.project_end_date }}
      </template>
      <template #start_station="{ record }">
        {{ record.start_station }}~{{ record.end_station }}
      </template>
      <template #status="{ record }">
          {{ statusType[record.status] }}
        </template>
      <template #created_date="{ record }">
        {{ dayjs(record.created_date).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <!-- <template #station_list="{ record }">
        {{record.station_list[0]?record.station_list[0]:'-'}} / {{record.station_list[1]?record.station_list[1]:'-'}}
      </template>
      <template #operate="{ record }">
        <a @click="edit(record)">编辑</a>
      </template> -->
    </a-table>
  </div>
</template>
