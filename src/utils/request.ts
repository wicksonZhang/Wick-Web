import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import qs from "qs";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },

  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查配置的响应类型是否为二进制类型（'blob' 或 'arraybuffer'）, 如果是，直接返回响应对象
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    // 获取 状态码、数据、消息
    const { code, data, msg } = response.data;
    if (code === ResultEnum.SUCCESS) {
      return data;
    }

    // 如果 code === 401 说明token已过期
    if (code === ResultEnum.TOKEN_INVALID) {
      ElNotification({
        title: "提示",
        message: "您的会话已过期，请重新登录",
        type: "info",
      });
      useUserStoreHook()
        .resetToken()
        .then(() => {
          location.reload();
        });
    } else {
      ElMessage.error(msg || "系统出错");
    }
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any) => {
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({ message: message, type: "error", duration: 5 * 1000 });
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
