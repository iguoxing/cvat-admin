/*
 * @Author: ArdenZhao
 * @Date: 2022-09-29 17:02:16
 * @LastEditTime: 2022-09-29 17:38:51
 * @FilePath: /cvat-admin/src/stores/interface.ts
 * @Description: file information
 */
import axios from "axios";
import { message } from "ant-design-vue";
// let startTime = ''

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = "Token " + localStorage.token;
    // config.headers.Authorization = "Bearer " + localStorage.token;
    config.headers["Cache-Control"] = "no-cache";
    if (/get/i.test(config.method)) {
      // 判断get请求
      config.params = config.params || {};
      config.params.t = Date.parse(new Date()) / 1000; // 添加时间戳
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response && response.data && response.data.code == 200) {
      return response;
    }
    if (response && response.data && response.data.code == 403) {
      location.href = process.env.VUE_APP_HOME_URL;
      localStorage.removeItem("token");
      message.error(response.data.message);
    }
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    message.error(error.msg || "请求失败!");
    return Promise.reject(error);
  }
);

export default axios;
