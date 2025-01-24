import Sort from "@/app/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/app/components/Card";
import React from "react";
const Page = async ({ params }: SearchParamProps) => {
  const type = (await params)?.type as string | "";
  const files = await getFiles();
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <div className="body-1">
            Total : <span className="h5">{0} MB</span>
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
            <div className="file-item">
              <Card key={file.$id} file={file}></Card>
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
