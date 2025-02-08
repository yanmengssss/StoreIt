import React from "react";
import Slidebar from "@/app/components/Slidebar";
import Header from "../components/Header";
import MobileNavigatic from "../components/MobileNavigatic";
import { getUserInfo } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { getInfo } from "@/lib/apis/user";
export const dynamic = "force-dynamic";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  let currentUser: any = await getInfo();
  // console.log(currentUser);
  // const currentUser: any = await getInfo();
  // console.log(a,123)
  if (currentUser.code !== 200) {
    return redirect("/sign-in");
  }
  currentUser = currentUser.data;
  return (
    <main className="flex h-screen">
      <Slidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigatic {...currentUser} />
        <Header ownerId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};
export default Layout;
