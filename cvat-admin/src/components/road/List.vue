<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-03 11:38:33
 * @LastEditTime: 2022-10-30 16:11:49
 * @FilePath: /cvat-admin/src/components/road/List.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";

const labelType = {
  bbox: "矩形",
  rectangle: "矩形",
  ellipse: "椭圆",
  polyline: "多边形",
  tag: "标签",
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "开始/结束时间",
    dataIndex: "start_date",
    slots: { customRender: "start_date" },
  },
  // {
  //   title: "结束时间",
  //   dataIndex: "end_date",
  // },
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
  // {
  //   title: "总图数",
  //   dataIndex: "frame_num",
  // },
  {
    title: "桩号",
    dataIndex: "station_list",
    slots: { customRender: "station_list" },
  },
  {
    title: "抽检",
    dataIndex: "qa_rate",
    slots: { customRender: "qa_rate" },
  },
  // {
  //   title: "标签",
  //   dataIndex: "labels",
  //   slots: { customRender: "labels" },
  // },
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
const selectedRowKeys = ref([]);
const res = ref([]);
const router = useRouter();
const pagination = ref({ pageSize: 10, current: 1, total: 0 });

function setProjectPage(item: { id: any }) {
  localStorage.projectInfo =
    item && item.id ? JSON.stringify(item) : JSON.stringify({ name: item });
}

function newRoad() {
  router.push({ name: "roadNew" });
}
function onSelectChange(selectedRowKeys: any) {
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  selectedRowKeys = selectedRowKeys;
}

function edit(item: { id: string }) {
  // console.log("item: ", item, );
  router.push("edit/" + item.id);
}

function stationList(item: { id: string }) {
  setProjectPage(item);
  router.push("stationlist/" + item.id);
}

function newStation(item: { id: string }) {
  // console.log("item: ", item, );
  setProjectPage(item);
  router.push("station/" + item.id);
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

  promise.then((result: any) => {
    if (result) {
      res.value = result.results;
      pagination.value.total = result.count;
      console.log(res.value);
    }
  });
}

function deleteItem(item) {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: import.meta.env.VITE_APP_BASE_URL + "api/projects/" + item.id,
    }).then(function (data) {
      resolve(data);
    });
  });

  promise.then((result: any) => {
    getList();
  });
}

onMounted(() => {
  getList();
});
</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 200px">
        <a-page-header title="路线管理" />
        <!-- <a-page-header title="路线管理" sub-title="Road Manage" /> -->
      </a-col>
      <a-col>
        <a-button type="primary" @click="newRoad"> 新建路线 </a-button>
      </a-col>
    </a-row>
    <!-- :row-selection="{
        selectedRowKeys: selectedRowKeys.value,
        onChange: onSelectChange,
      }" -->
    <a-table
      :columns="columns"
      :data-source="res"
      :pagination="pagination"
      :bordered="true"
      @change="handleTableChange"
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
      <template #qa_rate="{ record }"> {{ record.qa_rate }}% </template>
      <template #labels="{ record }">
        <a-row v-for="(tag, index) in record.labels" :key="'l_' + index">
          {{ tag.name }} <a-tag :color="tag.color">{{ tag.color }}</a-tag> 【{{
            labelType[tag.type]
          }}】
        </a-row>
      </template>
      <template #operate="{ record }">
        <a @click="edit(record)" class="mr-3">
          <a-tag color="orange">编辑</a-tag>
        </a>
        <!-- <a-divider type="vertical" /> -->
        <a @click="stationList(record)" class="mr-3">
          <a-tag color="cyan">桩号列表</a-tag>
        </a>
        <!-- <a-divider type="vertical" /> -->
        <a @click="deleteItem(record)">
          <a-tag color="red">删除</a-tag>
        </a>
        <!-- <a-divider type="vertical" />
        <a @click="newStation(record)">新建桩号</a> -->
      </template>
    </a-table>
  </div>
</template>
