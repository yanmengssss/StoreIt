"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { config } from "./appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client();
  client.setEndpoint(config.endpointUrl).setProject(config.projectId);
  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session found");
  }
  client.setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};
export const createAdminClient = async () => {
  const client = new Client();
  client
    .setEndpoint(config.endpointUrl)
    .setProject(config.projectId)
    .setKey(config.secretKey);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
