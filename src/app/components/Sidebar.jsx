"use client";
import Image from "next/image";
import React, { useEffect } from "react";

const Sidebar = ({
  chats,
  getChatTitle,
  sidebarOpen,
  setSidebarOpen,
  activeChatId,
  switchChat,
  createNewChat
}) => {
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when sidebar is open
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sidebarOpen]);

  console.log(chats);

  const chatHistory = chats.filter((curr) => curr.messages.length > 0);

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black  bg-opacity-50  transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static bg-gray-100 z-50 w-full top-0 left-0 h-screen border-r shadow-md overflow-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "max-w-72 p-5" : "max-w-0 p-0"
        }`}
      >
        <div className="flex justify-between">
          <div
            className="bg-gray-200 cursor-pointer p-3 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/sidebar-close.svg"
            />
          </div>
          <div
            className="bg-gray-200 cursor-pointer p-3 rounded-md"
            onClick={createNewChat}
          >
            <Image
              alt=""
              className=""
              width={20}
              height={20}
              src="/assets/edit.svg"
            />
          </div>
        </div>
        <div className="flex  py-5">
          <ul className="w-full">
            {chatHistory.length > 0 ? (
              chatHistory.map(
                (chat) =>
                  chat.messages.length > 0 && (
                    <li
                      key={chat.id}
                      onClick={() => switchChat(chat.id)}
                      className={`p-2  w-full hover:bg-gray-200 rounded-md cursor-pointer ${
                        chat.id == activeChatId
                          ? "bg-gray-300"
                          : "bg-transparent"
                      }`}
                    >
                      {getChatTitle(chat)}
                    </li>
                  )
              )
            ) : (
              <li
                className={`p-2 text-center  w-full rounded-md bg-gray-300`}
              >
                No Chats Present
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
