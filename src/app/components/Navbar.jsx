import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = ({
  sidebarOpen,
  startNewChat,
  setSidebarOpen,
  show = true,
  name = ""
}) => {
  return (
    <div className="h-20 p-5 flex items-center justify-between ">
      <div>
        {" "}
        {!sidebarOpen && show && (
          <div
            className="bg-gray-200 cursor-pointer p-3 rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/sidebar-open.svg"
            />
          </div>
        )}
        {name !== "" && (
          <div className="capitalize text-xl lg:text-2xl font-bold">{name}</div>
        )}
      </div>
      <div className="flex gap-3 items-center">
        {show && (
          <Link
            className="bg-gray-200 flex items-center gap-2 cursor-pointer p-3 rounded-md"
            href="/analytics"
          >
            <p className="hidden lg:flex font-medium">Anlaytics</p>
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/analytics.svg"
            />
          </Link>
        )}
        {show ? (
          <div
            className="bg-gray-200 cursor-pointer lg:hidden p-3 rounded-md"
            onClick={startNewChat}
          >
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/edit.svg"
            />
          </div>
        ) : (
          <Link href="/" className="bg-gray-200 flex items-center gap-2 cursor-pointer p-3 rounded-md">
            <p className="hidden lg:flex font-medium">Chat</p>
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/chat.svg"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
