"use client";
import { useState, useEffect } from "react";
import Sort from "@/app/components/Sort";
import { getFiless } from "@/lib/apis/files";
import { Models } from "node-appwrite";
import Card from "@/app/components/Card";
import React from "react";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
// import { useSearchParams } from "next/navigation";
// import { useStore } from "zustand";
import commonStore from "@/store/common";

const Page = ({ searchParams, params }: SearchParamProps) => {
  const [files, setFiles] = useState<any>({
    documents: [],
    total: 0,
  });
  const [size, setSize] = useState(0);
  const { changePage } = commonStore();
  // const type = (await params)?.type as string | "";
  // const searchText = (await searchParams)?.query as string | "";
  // const sort = (await searchParams)?.sort as string | "";

  const [type, setType] = useState("");
  const [searchText, setsearchText] = useState("");
  const [sort, setsort] = useState("");
  // const [types, setTypes] = useState([]);
  const fetchData = async () => {
    // setType((await params)?.type as string | "");
    // setsearchText((await searchParams)?.query as string | "");
    // setsort((await searchParams)?.sort as string | "");
    setTimeout(async () => {
      console.log(sort, searchText, getFileTypesParams(type), type, 123);
      const res = await getFiless({
        types: getFileTypesParams((await params)?.type as string | ""),
        searchText: (await searchParams)?.query as string | "",
        sort: (await searchParams)?.sort as string | "",
      });
      if (res && res.code === 200) {
        setFiles(res.data);

        // Calculate total size of files
        let totalSize = 0;
        res.data.documents?.forEach((file: Models.Document) => {
          totalSize += file.size;
        });
        setSize(totalSize);
      }
    }, 0);
  };

  useEffect(() => {
    setFiles({
      documents: [],
      total: 0,
    });
    setSize(0);
    fetchData();
  }, [searchParams, changePage]);
  // useEffect(() => {
  //   com
  // }, []);
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
        // @ts-ignore
        <section className="file-list" key={"file-list"}>
          {files.documents.map((file: Models.Document) => (
            <div className="file-item" key={file.$id}>
              <Card file={file} key={file.$id} />
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
