"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import userStore from "@/store/user";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOut } from "@/lib/actions/user.actions";
import { logOut } from "@/lib/apis/user";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
interface Props {
  ownerId: string;
  accountId: string;
}
const Header = ({ ownerId, accountId }: Props) => {
  const { toast } = useToast();
  const logout = async () => {
    const res = await logOut();
    if (res.code == 200) redirect("/sign-in");
    else
      toast({
        duration: 2000,
        description: <span className="text-error">退出登陆失败</span>,
      });
  };
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form aria-expanded action={logout} className="sign-out-button">
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="search"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;
