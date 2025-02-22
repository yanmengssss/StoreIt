"use client";
import React, { use, useEffect, useState } from "react";
import { Models } from "node-appwrite";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl, downloadFile } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";
import { getUserInfo } from "@/lib/actions/user.actions";
import { getInfo } from "@/lib/apis/user";
import { deleteFiless, reName, shareFile } from "@/lib/apis/files";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import commonStore from "@/store/common";
const ActionDropdown = ({
  file,
  email: currentUserEmail,
}: {
  file: Models.Document;
  email: string;
}) => {
  const { changePage, setChangePage } = commonStore();

  const path = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name.split(".").slice(0, -1).join("."));
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    if (!isModalOpen) {
      setisDropDownOpen(false);
    }
    if (isDropDownOpen) {
      setisDropDownOpen(false);
    }
  }, [isModalOpen]);

  const closeAllModals = () => {
    setisModalOpen(false);
    setisDropDownOpen(false);
    setAction(null);
    setName(file.name);
  };
  const handleRemoveUser = async (email: string, file: Models.Document) => {
    const updateEmail = emails.filter((e) => e !== email);
    // const success = await updateFileUsers({
    //   fileId: file._id,
    //   emails: updateEmail,
    //   path,
    // });
    const success = await shareFile({
      bucketFileId: file.bucketFileId,
      users: [email],
      type: "del",
    });
    if (success) {
      router.refresh();
      toast({
        duration: 1000,
        description: "移除成功！",
      });
    }
  };
  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    // let success = false;
    const actions = {
      rename: () =>
        // renameFile({
        //   fileId: file._id,
        //   Name: name,
        //   extension: file.extension,
        //   path,
        // }),
        reName({
          bucketFileId: file.bucketFileId,
          name,
          extension: file.extension,
        }),
      share: () =>
        // updateFileUsers({
        //   fileId: file._id,
        //   emails,
        //   path,
        // }),
        shareFile({
          bucketFileId: file.bucketFileId,
          users: emails,
          type: "add",
        }),
      delete: () =>
        // deleteFile({ fileId: file.$id, path, bucketFileId: file.bucketFielId }),
        deleteFiless({ bucketFileId: file.bucketFileId }),
    };
    let res = await actions[action.value as keyof typeof actions]();
    //console.log(res);
    if (res.code === 200) {
      // closeAllModals();
      setIsLoading(false);
      toast({
        description: `File updated successfully`,
        duration: 2000,
      });
      // router.refresh();

      setChangePage(!changePage);
    } else {
      setIsLoading(false);
      toast({
        description: `File updated failed`,
        duration: 2000,
      });
    }
  };
  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
              currentUserEmail={currentUserEmail}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span> ?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            {(value !== "share" || file.owner.email === currentUserEmail) && (
              <Button onClick={handleAction} className="modal-submit-button">
                <p className="capitalize">{value}</p>
                {isLoading && (
                  <Image
                    className="animate-spin"
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                  />
                )}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setisDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="more"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);
                if (
                  ["rename", "delete", "share", "details"].includes(
                    actionItem.value
                  )
                ) {
                  setisModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <div
                  // href={file.url}
                  // download={file.name}
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    downloadFile(file.url, file.name, file.extension);
                  }}
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              ) : (
                (actionItem.value !== "delete" ||
                  currentUserEmail === file.owner.email) && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                )
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
