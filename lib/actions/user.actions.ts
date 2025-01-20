"use server";

import { createAdminClient, createSessionClient } from "@/lib";
import { config } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringfy } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
//注册
//查询数据库
// 根据邮箱查询用户信息
const getUSerByEmail = async (email: string) => {
  // 创建数据库客户端
  const { databases } = await createAdminClient();
  // 查询数据库中是否存在该邮箱的用户
  const result = await databases.listDocuments(
    config.databaseId, //指定数据库id
    config.usersCollectionId, //指定集合id
    [Query.equal("email", [email])] //指定查询条件，查找email字段的值等于email的数据
  );
  // 如果查询结果大于0则返回第一条记录,否则返回null
  return result.total > 0 ? result.documents[0] : null;
};
//发送邮件
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient(); //创建一个管理员端会话
  try {
    const session = await account.createEmailToken(ID.unique(), email); //创建一个邮箱验证令牌，ID.unique()生成一个唯一的ID，email是要发送的邮箱
    return session.userId; //这个用户的userID，后续才可以继续执行验证操作
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
export const createAccount = async ({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) => {
  const existingUser = await getUSerByEmail(email); //查询这个邮箱是否已经注册过了
  const accountId = await sendEmailOTP({ email }); //发送邮箱验证码
  if (!accountId) throw new Error("Failed to send an OTP"); //如果发送失败，则抛出错误
  if (!existingUser) {
    //如果这个邮箱没有注册过，则创建一个用户
    const { databases } = await createAdminClient();
    await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        email,
        fullName,
        avatar: avatarPlaceholderUrl,
        accountId,
      }
    );
  }
  return parseStringfy({ accountId });
};
//验证OTP
export const verifyOTP = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringfy({ sessionId: session.$id });
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

//获取用户信息
export const getUserInfo = async () => {
  const { databases, account } = await createSessionClient();
  const result = await account.get();
  const user = await databases.listDocuments(
    config.databaseId,
    config.usersCollectionId,
    [Query.equal("accountId", [result.$id])]
  );
  if (user.total <= 0) return null;
  return parseStringfy(user.documents[0]);
};

//退出登陆
export const signOut = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  } finally {
    redirect("/sign-in");
  }
};
