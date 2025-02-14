// import Slidebar from "@/app/components/Slidebar";
// import Header from "../components/Header";
// import MobileNavigatic from "../components/MobileNavigatic";
// import { getUserInfo } from "@/lib/actions/user.actions";
// import { redirect } from "next/navigation";
// import { Toaster } from "@/components/ui/toaster";
// import { getInfo } from "@/lib/apis/user";

// export const dynamic = "force-dynamic";
// const Layout = async ({ children }: { children: React.ReactNode }) => {
//   let currentUser: any = null;
//   {
//     ("use client");
//     useEffect(async () => {
//       currentUser = await getInfo();
//       console.log(currentUser, 123);
//       // const currentUser: any = await getInfo();
//       // //console.log(a,123)
//       if (currentUser.code !== 200) {
//         return redirect("/sign-in");
//       }
//       currentUser = currentUser.data;
//     });
//   }
//   return (
//     <main className="flex h-screen">
//       <Slidebar {...currentUser} />
//       <section className="flex h-full flex-1 flex-col">
//         <MobileNavigatic {...currentUser} />
//         <Header ownerId={currentUser._id} accountId={currentUser.accountId} />
//         <div className="main-content">{children}</div>
//       </section>
//       <Toaster />
//     </main>
//   );
// };
// export default Layout;
"use client"; // 强制让这个组件在客户端执行

import React, { useEffect, useState } from "react";
import Slidebar from "@/app/components/Slidebar";
import Header from "../components/Header";
import MobileNavigatic from "../components/MobileNavigatic";
import { Toaster } from "@/components/ui/toaster";
import { getInfo } from "@/lib/apis/user";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>({
    _id: "67ad7b7ffab76412f085b94d",
    fullName: "withoutLogin",
    email: "withoutLogin",
    accountId: "-1",
    avatar: "https://img95.699pic.com/element/40203/3579.png_300.png",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getInfo();
      console.log(response);
      if (response.code !== 200) {
        window.location.href = "/sign-in"; // 重定向
      }

      setCurrentUser(response.data);
    };

    fetchUserInfo();
  }, []); // 空依赖，确保只在客户端首次加载时执行

  return (
    <main className="flex h-screen">
      <Slidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigatic {...currentUser} />
        <Header ownerId={currentUser._id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;
