<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../../stores/interface";
import dayjs from "dayjs";
const roleOptions = [
  { label: "管理员", value: "admin" },
  // { label: "项目经理", value: "business" },
  // { label: "用户", value: "user" },
  { label: "标注员", value: "worker" },
  { label: "质检员", value: "qa" },
];
const staffOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const superUserOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const activeOptions = [
  { label: '可用', value: true },
  { label: '不可用', value: false },
];
const router = useRouter();
const route = useRoute();
console.log('query', route.query);
// console.log("route params: ", route.params);
const query = route.query;
const isNew = route.query.id == undefined;
const res = ref([]);
function newRoad() {
  console.log("newRoad");
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

  promise.then((result) => {
    if (result) {
      // res.value = result.results;
      console.log(res.value);
    }
  });
}

const formState = reactive<FormState>({
  username: isNew ? "" : query.username,
  password: "",
  // confirmPassword: "",
  // first_name: "",
  // last_name: "",
  email: "",
  // groups: [],
  role: isNew ? "admin" : query.groups[0],
  is_staff: true,
  is_superuser: true,
  is_active: true,
});
const onFinish = (values: any) => {
  console.log("Success:", values);
  save();
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

function cancel() {
  router.go(-1);
}

function save() {
  console.log(formState);
  let url = import.meta.env.VITE_APP_BASE_URL + "api/users";;
  let data;
  let method = "POST";
  if (isNew) {
    data = {
      username: formState.username,
      password: formState.password,
      first_name: '',
      last_name: '',
      email: formState.email,
      groups: [formState.role],
      is_staff: formState.role === 'admin' ? true : false,
      is_superuser: formState.role === 'admin' ? true : false,
      is_active: true,
    };
  } else {
    url = import.meta.env.VITE_APP_BASE_URL + "api/users/" + query.id;
    method = 'patch';
    data = {
      username: formState.username,
      password: formState.password,
      groups: [formState.role],
      is_staff: formState.role === 'admin' ? true : false,
      is_superuser:  formState.role === 'admin' ? true : false,
    };
  }
  console.log(data);
  axios({
    method,
    url,
    data,
  }).then(function (data) {
    console.log('保存成功');
    router.push({ name: "person" });
  });
}

onMounted(() => {
  
});
</script>

<template>
  <div>
    <a-page-header :title="`人员${isNew ? '新增' : '编辑'}`" @back="cancel" />
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '请输入用户名!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input v-model:value="formState.password" />
      </a-form-item>

      <!-- <a-form-item
        label="确认密码"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.confirmPassword" />
      </a-form-item> -->
      <!-- <a-form-item
        label="姓"
        name="firstName"
      >
        <a-input v-model:value="formState.first_name" />
      </a-form-item> -->
      <!-- <a-form-item
        label="名"
        name="lastName"
      >
        <a-input v-model:value="formState.last_name" />
      </a-form-item> -->
      <template v-show="isNew">
        <a-form-item
          label="电子邮箱"
          name="email"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </template>
      <a-form-item
        label="用户组"
        name="role"
      >
        <a-radio-group v-model:value="formState.role" :options="roleOptions" />
      </a-form-item>
      <!-- <a-form-item
        label="是否员工"
        name="isStaff"
      >
        <a-radio-group v-model:value="formState.is_staff" :options="staffOptions" />
      </a-form-item> -->
      <!-- <a-form-item
        label="是否超级用户"
        name="isSuperuser"
      >
        <a-radio-group v-model:value="formState.is_superuser" :options="superUserOptions" />
      </a-form-item> -->
      <!-- <a-form-item
        label="是否可用"
        name="email"
      >
        <a-radio-group v-model:value="formState.is_active" :options="activeOptions" />
      </a-form-item> -->
      <a-row type="flex" justify="center" align="start" class="mt-3">
        <a-col>
          <a-button type="primary" html-type="submit">
            保存
          </a-button>
          <a-button class="ml-3" @click="cancel"> 取消 </a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface FormState {
  username: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
}
export default defineComponent({
  setup() {
    const formState = reactive<FormState>({
      username: "",
      password: "",
      confirmPassword: "",
      remember: true,
    });
    const onFinish = (values: any) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>
