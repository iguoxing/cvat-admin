<!--
 * @Author: ArdenZhao
 * @Date: 2022-10-03 11:38:33
 * @LastEditTime: 2023-01-10 19:43:50
 * @FilePath: /cvat-admin/src/components/road/List.vue
 * @Description: file information
-->

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import handleMilesData from "../../utils/handleMiles.js";
import {
  EditOutlined,
  MenuUnfoldOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import axios from "../../stores/interface";
import { useRouter, useRoute } from "vue-router";
import { func } from "vue-types";

const labelType = {
  bbox: "矩形",
  rectangle: "矩形",
  ellipse: "椭圆",
  polyline: "曲线",
  tag: "标签",
};
const statusType = {
  annotation: "标注",
  validation: "质检",
  completed: "完成",
};

const columns = [
  // {
  //   title: "ID",
  //   dataIndex: "id",
  // },
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "路线编号",
    dataIndex: "ppid",
  },
  {
    title: "方向",
    dataIndex: "direction",
  },
  {
    title: "桩号",
    dataIndex: "station_list",
    slots: { customRender: "station_list" },
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
    slots: { customRender: "status" },
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

function getFile(item: { id: string }) {
  console.log("getFile");
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/stat_2/",
      params: {
        down_stat: "proj_stat",
        project_id: item.id,
      },
    }).then(function (data) {
      resolve(data && data.data);
    });
  });

  promise.then((result: any) => {
    if (result) {
      console.log(result);
    }
  });
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
function handleMiles(val: string | any[]) {
  let len = val.length;
  let leftNum = val.slice(0, len - 3);
  let rightNum = val.slice(len - 3);
  let res = parseInt(leftNum) + "." + parseInt(rightNum);
  console.log("res", leftNum, rightNum, res);
  return res;
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
      result.results.forEach((value, index, array) => {
        let path = value.files_path.split("/");
        if (path[1] && path[1].length > 12) {
          let ppid = path[1].slice(9, 13);
          value.ppid = ppid;
          let direction = path[1].slice(13, 14);
          value.direction = direction;
        }
      });
      res.value = result.results;
      pagination.value.total = result.count;
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

function cancelDelete(e) {
  console.log(e);
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
      </a-col>
      <a-col>
        <a-button class="mt-1" type="primary" danger @click="newRoad">
          新建路线
        </a-button>
      </a-col>
    </a-row>
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
        {{ record.start_station ? handleMilesData(record.start_station) : "-" }}
        -
        {{ record.end_station ? handleMilesData(record.end_station) : "-" }}
      </template>
      <template #status="{ record }">
        <a-tag color="red" v-if="record.status=='annotation'">{{ statusType[record.status] }}</a-tag>
        <a-tag color="red" v-if="record.status=='blue'">{{ statusType[record.status] }}</a-tag>
        <a-tag color="red" v-if="record.status=='green'">{{ statusType[record.status] }}</a-tag>
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
        <div class="flex">
          <a @click="edit(record)" class="mr-1">
            <a-popover>
              <template #content>
                <p>编辑</p>
              </template>
              <a-tag color="#1890ff"><EditOutlined /></a-tag>
            </a-popover>
          </a>
          <a @click="stationList(record)" class="mr-1">
            <a-popover>
              <template #content>
                <p>桩号列表</p>
              </template>
              <a-tag color="#1890ff"><MenuUnfoldOutlined /></a-tag>
            </a-popover>
          </a>
          <!-- <a @click="getFile(record)" class="mr-1">
            <a-popover>
              <template #content>
                <p>下载</p>
              </template>
              <a-tag color="#1890ff"><DownloadOutlined /></a-tag>
            </a-popover>
          </a> -->
          <a-popconfirm
            title="确认删除该路线吗?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="deleteItem(record)"
            @cancel="cancelDelete"
          >
            <a-popover>
              <template #content>
                <p>删除</p>
              </template>
              <a-tag color="#1890ff"><DeleteOutlined /></a-tag>
            </a-popover>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </div>
</template>
