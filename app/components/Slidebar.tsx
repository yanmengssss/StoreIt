"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
const Slidebar = ({
  fullName,
  avatar,
  email,
}: {
  fullName: string;
  avatar: string;
  email: string;
}) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="home"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map((item) => (
            <Link href={item.url} key={item.name} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === item.url && "shad-active"
                )}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === item.url && "nav-icon-active"
                  )}
                ></Image>
                <p className="hidden lg:block">{item.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      ></Image>
      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        ></Image>
        <div className="hidden lg:block">
          <p className="subtitle-2">{fullName}</p>
          <p className="body-2">{email}</p>
        </div>
      </div>
    </aside>
  );
};
export default Slidebar;
