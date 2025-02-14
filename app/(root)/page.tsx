"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "zustand";
import Link from "next/link";
import { Models } from "node-appwrite";
import { getInfo } from "@/lib/apis/user";
import ActionDropdown from "@/app/components/ActionDropdown";
import { Chart } from "@/app/components/Chart";
import FormattedDateTime from "@/app/components/FormattedDateTime";
import Thumbnail from "@/app/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getFileReadurl, getUsageSummary } from "@/lib/utils";
import { getTotalData, getFiless } from "@/lib/apis/files";
import commonStore from "@/store/common";
const Dashboard = () => {
  // State to store the data for total space and files
  const [totalSpace, setTotalSpace] = useState<any>({
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
  });
  const changePage = useStore(commonStore, (state) => state.changePage);
  const [files, setFiles] = useState<{
    documents: Models.Document[];
    total: number;
  }>({
    documents: [],
    total: 0,
  });
  const [email, setEmail] = useState("");
  const fetchData = async () => {
    let res1: any = null;
    let res2: any = null;
    let res3: any = null;
    [res1, res2, res3] = await Promise.all([
      // getFiles({ types: [], limit: 10 }),
      getFiless({ limit: 10 }),
      // getTotalSpaceUsed(),
      getTotalData(),
      getInfo(),
    ]);

    if (res2 && res2.code === 200) {
      setTotalSpace(res2.data);
    }
    if (res1 && res1.code === 200) {
      setFiles(res1.data);
    }
    if (res3 && res3.code === 200) {
      setEmail(res3.data.email);
    }
  };
  useEffect(() => {
    fetchData();
  }, [changePage]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace) || [];

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={getFileReadurl(file.extension, file.url) || file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file._id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} email={email} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
