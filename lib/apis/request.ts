import axios from "axios";
import { redirect } from "next/navigation";
// axios.defaults.baseURL = "http://47.119.148.251:7000";
axios.defaults.baseURL = "http://127.0.0.1:7000";
// axios.defaults.baseURL = "https://yanmengsss.xyz";
axios.defaults.withCredentials = true;
(axios.defaults as any).credentials = "include";
interface QueueItem {
  options: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class RequestQueue {
  private queue: QueueItem[] = [];
  private activeCount = 0;
  private readonly maxConcurrent = 3; //最大并发数

  async add(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const queueItem = { options, resolve, reject };
      //查看请求参数的请求头是否有pop
      if (options.headers && options.headers.pop) {
        //去掉请求头中的pop
        delete options.headers.pop;
        if (this.activeCount < this.maxConcurrent) {
          // 如果当前活跃请求数小于最大并发数，直接执行
          this.processRequest(queueItem);
        } else {
          // 否则加入队列
          this.queue.push(queueItem);
        }
      } else {
        this.processRequest(queueItem);
      }
    });
  }

  private async processRequest(queueItem: QueueItem) {
    this.activeCount++;

    try {
      const response = await axiosInstance(queueItem.options);
      queueItem.resolve(response.data);
    } catch (error) {
      queueItem.resolve({ code: 400, error });
    } finally {
      this.activeCount--;
      this.processNextRequest();
    }
  }

  private processNextRequest() {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        this.processRequest(nextRequest);
      }
    }
  }

  // 清除所有请求队列
  clearQueue() {
    this.queue = [];
    this.activeCount = 0;
  }
}

const axiosInstance = axios.create({
  timeout: 7 * 1000, // 请求超时时间（5秒）
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response?.status === 401) {
        // Handle unauthorized response
      }
      // Redirect to sign-in page
      redirect("/sign-in");
    }
    return Promise.reject(error);
  }
);

const requestQueue = new RequestQueue();

export const request = (options: any) => {
  return requestQueue.add(options);
};

// 导出清除队列方法
export const clearRequestQueue = () => {
  requestQueue.clearQueue();
};
