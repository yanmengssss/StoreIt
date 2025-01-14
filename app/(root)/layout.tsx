import React from "react";
import Slidebar from "@/app/components/Slidebar";
import Header from "../components/Header";
import MobileNavigatic from "../components/MobileNavigatic";
import { getUserInfo } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getUserInfo();
  if (!currentUser) {
    return redirect("/sign-in");
  }
  return (
    <main className="flex h-screen">
      <Slidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigatic {...currentUser} />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};
export default Layout;
