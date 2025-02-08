"use server";

import { createAdminClient } from "@/lib";
import { ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { config as appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "../utils";
import { revalidatePath } from "next/cache";
import { getUserInfo } from "@/lib/actions/user.actions";
import { getInfo } from "../apis/user";
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFielId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .then((res) => res)
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        // handleError(error, "Failed to create file document");
        return {
          code: 400,
          message: error,
        };
      });

    revalidatePath(path);
    // return parseStringfy(newFile);
    return {
      data: newFile,
      code: 200,
      message: "success",
    };
  } catch (error) {
    // handleError(error, "Failed to upload file");
    // throw error;
    return {
      code: 400,
      message: error,
    };
  } finally {
  }
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    let currentUser: any = await getInfo();
    if (currentUser.code !== 200) throw new Error("User not found");
    currentUser = currentUser.data;
    const queries = createQueries(currentUser, types, searchText, sort, limit);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    // return parseStringfy(files);
    return {
      code: 200,
      data: files,
    };
  } catch (error) {
    // handleError(error, "Failed to get current user");
    return {
      code: 400,
      message: error,
    };
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  if (types && types.length > 0) {
    queries.push(Query.equal("type", types));
  }
  if (searchText) {
    queries.push(Query.contains("name", searchText));
  }
  if (limit) {
    queries.push(Query.limit(limit));
  }
  const [sortBy, orderBy] = sort.split("-");
  if (sortBy && orderBy) {
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }
  return queries;
};

export const renameFile = async ({
  fileId,
  Name,
  extension,
  path,
}: {
  fileId: string;
  Name: string;
  extension: string;
  path: string;
}) => {
  const { databases } = await createAdminClient();
  try {
    const name = Name.split(".").slice(0, -1).join(".");
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    );
    revalidatePath(path);
    // return parseStringfy(updatedFile);
    return {
      data: updatedFile,
      code: 200,
      message: "success",
    };
  } catch (error) {
    // handleError(error, "Failed to rename file");
    return {
      code: 400,
      message: error,
    };
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: {
  fileId: string;
  emails: string[];
  path: string;
}) => {
  const { databases } = await createAdminClient();
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: emails }
    );
    revalidatePath(path);
    // return parseStringfy(updatedFile);
    return {
      data: updatedFile,
      code: 200,
      message: "success",
    };
  } catch (error) {
    // handleError(error, "Failed to rename file");
    return {
      code: 400,
      message: error,
    };
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: {
  fileId: string;
  bucketFileId: string;
  path: string;
}) => {
  const { databases, storage } = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    // return parseStringfy({ status: "success" });
    return {
      code: 200,
      message: "success",
    };
  } catch (error) {
    // handleError(error, "Failed to delete file");
    return {
      code: 400,
      message: error,
    };
  }
};

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createAdminClient();
    const currentUser: any = await getInfo();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.data._id])]
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });
    // console.log(totalSpace);
    return {
      code: 200,
      data: totalSpace,
    };
    // return parseStringfy(totalSpace);
  } catch (error) {
    // handleError(error, "Error calculating total space used:, ");
    return {
      code: 400,
      message: error,
    };
  }
}
