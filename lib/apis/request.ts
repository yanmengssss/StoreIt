import axios from "axios";
axios.defaults.baseURL = "http://47.119.148.251:7000";
axios.defaults.withCredentials = true;
(axios.defaults as any).credentials = "include";
const axiosInstance = axios.create({
  timeout: 7 * 1000, // 请求超时时间（7秒）
});

export const request = (options: any) => {
  return new Promise((resolve, reject) => {
    axiosInstance(options)
      .then((response: any) => resolve(response.data))
      .catch((error: any) => reject(error));
  });
};
