import Image from "next/image";
import React from "react";

const WelcomComponent = ({ handleChatStart }) => {
  return (
    <div className="flex gap-4 items-center flex-col">
      <Image
        width={120}
        height={40}
        alt=""
        className="animate-float"
        src="/assets/chat-home.svg"
      />
      <div className="text-gray-600 font-bold text-xl">Welcome to Chatbot</div>
      <div className="flex gap-2 flex-wrap max-w-sm items-center justify-center w-full">
        <div
          onClick={() => handleChatStart("Who is Sagar Kumar?")}
          className="px-6 border-2 p-1 cursor-pointer rounded-full border-gray-600"
        >
          Who is Sagar Kumar?
        </div>
        <div
          onClick={() => handleChatStart("Code")}
          className="px-6 border-2 p-1 cursor-pointer rounded-full border-gray-600"
        >
          Code
        </div>
        <div
          onClick={() => handleChatStart("Tell me something?")}
          className="px-6 border-2 p-1 cursor-pointer rounded-full border-gray-600"
        >
          Tell me something?
        </div>
      </div>
    </div>
  );
};

export default WelcomComponent;
