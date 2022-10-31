<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "../../stores/interface";
import dayjs from 'dayjs';
import { useRouter, useRoute } from "vue-router";
const roleOptions = {
  admin:"管理员",
  business:"项目经理",
  user:"用户",
  worker:"标注员",
  qa:"质检员",
}
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
  {
    title: "操作",
    dataIndex: "operate",
    slots: { customRender: "operate" },
  },
];

const res = ref([]);
const router = useRouter();

function handleCreate() {
  console.log("handleCreate");
  router.push({ name: "personCreate" });
}
function getList() {
  const promise = new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: import.meta.env.VITE_APP_BASE_URL + "api/users",
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

  promise.then((result: any) => {
    if (result) {
      res.value = result.results;
      console.log(res.value);
    }
  });
};

function edit(item: { id: string; }) {
  console.log('--', item);
  router.push({
    name: "personEdit",
    query: {
     id: item.id,
     username: item.username,
     groups: item.groups
    },
  });
}

onMounted(() => {
  getList()
});

</script>

<template>
  <div>
    <a-row type="flex" justify="between" align="start">
      <a-col flex="1 1 200px">
        <a-page-header title="人员管理" />
        <!-- <a-page-header title="人员管理" sub-title="Person Manage" /> -->
      </a-col>
      <a-col>
        <a-button type="primary" @click="handleCreate"> 新建人员 </a-button>
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="res"
      :pagination="false"
      :bordered="true"
    >
      <template #dateJoined="{ text }">
        <span>
          {{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}}
        </span>
      </template>
      <template #tags="{ text }">
        <span v-for="(label, i) in text" :key="'l' + i">
          {{roleOptions[label]}}
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
      <template #operate="{ record }">
        <a @click="edit(record)"><a-tag color="orange">编辑</a-tag></a>
      </template>
    </a-table>
  </div>
</template>
