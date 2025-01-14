// 标记这是一个服务器端组件
"use server";

// 从 node-appwrite 导入需要的类
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
// 导入 Appwrite 配置
import { config } from "./appwrite/config";
// 导入 Next.js cookies 工具函数
import { cookies } from "next/headers";

// 创建带有用户会话的客户端
export const createSessionClient = async () => {
  // 创建新的 Appwrite 客户端实例
  const client = new Client();
  // 设置 API 端点和项目 ID
  client.setEndpoint(config.endpointUrl).setProject(config.projectId);
  // 从 cookies 中获取会话信息
  const session = (await cookies()).get("appwrite-session");
  // 如果没有会话信息则抛出错误
  if (!session || !session.value) {
    throw new Error("No session found");
  }
  // 设置客户端的会话
  client.setSession(session.value);
  // 返回包含账户和数据库访问的对象
  return {
    // 获取账户实例的 getter
    get account() {
      return new Account(client);
    },
    // 获取数据库实例的 getter
    get databases() {
      return new Databases(client);
    },
  };
};

// 创建管理员客户端
export const createAdminClient = async () => {
  // 创建新的 Appwrite 客户端实例
  const client = new Client();
  // 设置 API 端点、项目 ID 和密钥
  client
    .setEndpoint(config.endpointUrl)
    .setProject(config.projectId)
    .setKey(config.secretKey);
  // 返回包含所有管理员权限服务的对象
  return {
    // 获取账户服务的 getter
    get account() {
      return new Account(client);
    },
    // 获取数据库服务的 getter
    get databases() {
      return new Databases(client);
    },
    // 获取存储服务的 getter
    get storage() {
      return new Storage(client);
    },
    // 获取头像服务的 getter
    get avatars() {
      return new Avatars(client);
    },
  };
};
