import Sort from "@/app/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/app/components/Card";
import React from "react";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = (await params)?.type as string | "";
  const searchText = (await searchParams)?.query as string | "";
  const sort = (await searchParams)?.sort as string | "";
  const types = getFileTypesParams(type) as FileType[];
  const res = await getFiles({ types, searchText, sort });
  let files: any = {
    documents: [],
    total: 0,
  };
  if (res && res.code === 200) {
    files = res.data;
  }
  let size = 0;
  files.documents?.map((file: Models.Document) => {
    size += file.size;
  });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <div className="body-1">
            Total : <span className="h5">{convertFileSize(size)}</span>
          </div>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <div className="file-item" key={file.$id}>
              <Card file={file}></Card>
            </div>
          ))}
        </section>
      ) : (
        <p className="empty-list">暂无上传文件</p>
      )}
    </div>
  );
};

export default Page;
