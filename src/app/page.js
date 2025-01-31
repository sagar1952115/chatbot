"use client";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import CodeBlock from "./components/CodeBlock";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { formatTimestamp } from "@/util/date";
import WelcomComponent from "./components/WelcomComponent";
import { markDownManager } from "@/util/mardownHandler";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const isCode = (text) =>
    text.toLowerCase().includes("code") || text.includes("```");

  const sendMessage = () => {
    if (!input.trim()) return;
    handleChatStart(input);
  };

  const handleChatStart = (input) => {
    const userMessage = {
      text: input,
      sender: "user",
      type: "markdown",
      timestamp: Date.now()
    };
    setChats((prevChats) => {
      const newChats = prevChats.map((chat) => {
        if (chat.id == activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage]
          };
        }
        return chat;
      });

      // Persist chats to localStorage
      localStorage.setItem("chats", JSON.stringify(newChats));
      return newChats;
    });

    setInput("");
    setTyping(true);

    const responseText = markDownManager(input);
    let index = 0;
    let currentText = "";

    // Add an empty bot message first
    setChats((prevChats) => {
      const newChats = prevChats.map((chat) => {
        if (chat.id == activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                text: "",
                sender: "bot",
                type: isCode(input) ? "code" : "markdown",
                timestamp: Date.now()
              }
            ]
          };
        }
        return chat;
      });

      // Persist chats to localStorage
      localStorage.setItem("chats", JSON.stringify(newChats));
      return newChats;
    });

    const interval = setInterval(() => {
      if (index < responseText.length) {
        currentText += responseText[index];
        setChats((prevChats) => {
          const newChats = prevChats.map((chat) => {
            if (chat.id == activeChatId) {
              return {
                ...chat,
                messages: [
                  ...chat.messages.slice(0, chat.messages.length - 1),
                  {
                    text: currentText,
                    sender: "bot",
                    type: isCode(input) ? "code" : "markdown",
                    timestamp: Date.now()
                  }
                ]
              };
            }
            return chat;
          });

          // Persist chats to localStorage
          localStorage.setItem("chats", JSON.stringify(newChats));
          return newChats;
        });
        index++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 30);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: [],
      name: `Chat ${chats.length + 1}`
    };

    // Add the new chat to the chats list
    setChats((prevChats) => {
      const newChats = [...prevChats, newChat];
      return newChats;
    });

    // Set the new chat as active
    switchChat(newChat.id);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeChatId]);

  const switchChat = (chatId) => {
    setActiveChatId(chatId);
    sessionStorage.setItem("activeChat", chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getChatTitle = (chat) => {
    const firstMessage = chat.messages[0]?.text || "";
    const firstFourWords = firstMessage.split(" ").slice(0, 4).join(" ");
    return firstFourWords ? `${firstFourWords}...` : "No messages";
  };

  useEffect(() => {
    // Load chats from localStorage when the component mounts
    const savedChats = localStorage.getItem("chats");
    const activeChat = sessionStorage.getItem("activeChat");
    console.log(savedChats);
    console.log(activeChatId);
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        if (activeChat) {
          console.log(activeChat);
          setActiveChatId(activeChat); // Set the last chat as active
        } else {
          createNewChat();
        }
      }
    } else {
      // Create the first chat if none exist
      createNewChat();
    }
  }, []);

  // Adjusts height dynamically
  const handleInput = (e) => {
    // setInput(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height to auto
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"; // Max height 150px
  };

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      // Mobile or smaller screen size
      setIsMobile(true);
      setSidebarOpen(false);
    } else {
      // Desktop or larger screen size
      setIsMobile(false);
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    handleResize(); // Set initial state based on current window size
    window.addEventListener("resize", handleResize); // Add resize event listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

  const activeChat = chats?.find((chat) => chat.id == activeChatId);

  return (
    <div className="flex">
      <Sidebar
        chats={chats}
        getChatTitle={getChatTitle}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeChatId={activeChatId}
        switchChat={switchChat}
        createNewChat={createNewChat}
      />
      <div className=" flex flex-col h-screen overflow-auto  flex-1">
        <Navbar
          sidebarOpen={sidebarOpen}
          startNewChat={createNewChat}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex flex-col h-full overflow-hidden ">
          <div className="flex-1 overflow-auto h-full  lg:p-0 ">
            <div className="max-w-4xl mx-auto p-3 h-full">
              <div className="space-y-4 h-full">
                {activeChat?.messages?.length ? (
                  activeChat?.messages?.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-gray-200 max-w-xs text-white self-end ml-auto"
                          : "bg-white text-gray-900 self-start"
                      }`}
                    >
                      {msg.type === "code" ? (
                        <div className="bg-gray-200 p-3 rounded-xl">
                          <CodeBlock code={msg.text} language="cpp" />
                          <p className="text-right text-xs">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                        </div>
                      ) : (
                        <div className="prose">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...rest }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return match ? (
                                  <SyntaxHighlighter
                                    PreTag="div"
                                    language={match[1]}
                                    style={dark}
                                    {...rest}
                                  >
                                    {children}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code {...rest} className={className}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {msg.text}
                          </ReactMarkdown>
                          <p className="text-right text-xs">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center flex-1">
                    <WelcomComponent handleChatStart={handleChatStart} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input stays at the bottom */}
          <div className=" max-w-4xl p-5  bg-white lg:py-8 mx-auto bg-white w-full sticky bottom-0">
            <div className=" bg-gray-100 border  rounded-lg p-2 flex items-center  shadow-md">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={handleInput}
                rows={1}
                placeholder="Type a message..."
                className="w-full resize-none bg-transparent overflow-y-auto max-h-[150px] focus:outline-none p-2"
              />
              <button
                onClick={sendMessage}
                className="ml-2  rounded-full bg-black p-2 text-white rounded"
                disabled={typing}
              >
                {typing ? (
                  <Image
                    width={20}
                    height={20}
                    alt=""
                    src="/assets/typing.svg"
                  />
                ) : (
                  <Image width={20} height={20} alt="" src="/assets/send.svg" />
                )}
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-3">
              This app is developed by <strong>Sagar Kumar</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
