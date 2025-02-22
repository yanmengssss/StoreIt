"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { uploadFile } from "@/lib/actions/file.actions";
import { uploadFiless } from "@/lib/apis/files";
import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE } from "@/constants";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import commonStore from "@/store/common";
interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { changePage, setChangePage } = commonStore();

  const onDrop = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const uploadPromise = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) =>
          prevFiles.filter((prevFile) => prevFile.name !== file.name)
        );
        toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is {MAX_FILE_SIZE}.
            </p>
          ),
          className: "error-toast",
        });
      }
      // return uploadFile({ file, ownerId, accountId, path }).then((res) => {
      return uploadFiless({ file, ownerId, accountId }).then((res: any) => {
        if (res.code === 200) {
          setFiles((prevFiles) =>
            prevFiles.filter((prevFile) => prevFile.name !== file.name)
          );
          toast({
            description: `${file.name} uploaded successfully`,
            //时间为1s
            duration: 1000,
            variant: "default",
          });
        } else {
          toast({
            description: (
              <span className="text-error">
                {" "}
                {file.name} uploaded failed ! {res.message}
              </span>
            ),
            //时间为1s
            duration: 1000,
            variant: "default",
          });
          setFiles((prevFiles) =>
            prevFiles.filter((prevFile) => prevFile.name !== file.name)
          );
        }
      });
    });
    await Promise.all(uploadPromise);
    if (files.length === 0) {
      console.log("上传完成");
      setChangePage(!changePage);
    }
  };
  // [ownerId, accountId]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    name: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default FileUploader;
