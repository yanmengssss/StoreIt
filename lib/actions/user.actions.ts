"use server";

import { createAdminClient } from "@/lib";
import { config } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringfy } from "../utils";
//注册
//查询数据库
const getUSerByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    config.databaseId,
    config.usersCollectionId,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};
//发送邮件
const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
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
  const existingUser = await getUSerByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        email,
        fullName,
        avatar:
          "https://dthezntil550i.cloudfront.net/p4/latest/p42102052243097410008650553/1280_960/12bc8bc0-2186-48fb-b432-6c011a559ec0.png",
        accountId,
      }
    );
  }
  return parseStringfy({ accountId });
};
