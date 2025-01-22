"use server";

import { UploaderFileProps } from "@/types";
import { createAdminClient } from "@/lib";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { config as appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "../utils";
import { revalidatePath } from "next/cache";
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploaderFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(bucketFile.name),
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      user: [],
      bucketFileId: bucketFile.$id,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        // handleError(error, "Failed to create file document");
      });
    revalidatePath(path);
    return parseStringfy(newFile);
  } catch (error) {
    // handleError(error, "Failed to upload file");
  } finally {
  }
};
