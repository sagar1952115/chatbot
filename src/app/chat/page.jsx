"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import CodeBlock from "../components/CodeBlock";
import Markdown from "react-markdown";
import { markdownContent } from "@/data";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const codeResponse = `#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(const string& str) {\n  int left = 0;\n  int right = str.length() - 1;\n  while (left < right) {\n    if (str[left] != str[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n}`;

  const markdownResponse = `
    # React Markdown Example
    
    - Some text
    - Some other text
    
    ## Subtitle
    
    ### Additional info
    
    This is a [link](https://github.com/remarkjs/react-markdown)
    `;

  const isCode = (text) =>
    text.toLowerCase().includes("code") || text.includes("```");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      type: "markdown"
    };

    // Add the user message to the active chat
    setChats((prevChats) => {
      const newChats = prevChats.map((chat) => {
        if (chat.id === activeChatId) {
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

    const responseText = isCode(input) ? codeResponse : markdownContent;
    let index = 0;
    let currentText = "";

    // Add an empty bot message first
    setChats((prevChats) => {
      const newChats = prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                text: "",
                sender: "bot",
                type: isCode(input) ? "code" : "markdown"
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
                    type: isCode(input) ? "code" : "markdown"
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

  // useEffect(() => {
  //   sessionStorage.setItem("activeChat", activeChatId);
  // }, [activeChatId]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: [],
      name: `Chat ${chats.length + 1}`
    };

    // Add the new chat to the chats list
    setChats((prevChats) => {
      const newChats = [...prevChats, newChat];
      // localStorage.setItem("chats", JSON.stringify(newChats));
      return newChats;
    });

    // Set the new chat as active
    switchChat(newChat.id);
  };

  const switchChat = (chatId) => {
    setActiveChatId(chatId);
    sessionStorage.setItem("activeChat", chatId);
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
      setSidebarOpen(false);
    } else {
      // Desktop or larger screen size
      setSidebarOpen(true);
    }
  };

  useLayoutEffect(() => {
    handleResize(); // Set initial state based on current window size
    window.addEventListener("resize", handleResize); // Add resize event listener
    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

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
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Section */}
        <div className="flex flex-col h-full overflow-hidden ">
          {/* Scrollable content */}
          <div className="flex-1 overflow-auto  p-5 lg:p-0 ">
            {/* Your dynamic content here */}
            <div className="max-w-4xl mx-auto p-3">
              <div className="space-y-4">
                {chats
                  .find((chat) => chat.id == activeChatId)
                  ?.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3  rounded-lg ${
                        msg.sender === "user"
                          ? "bg-gray-200 max-w-xs text-white self-end ml-auto"
                          : "bg-white text-gray-900 self-start"
                      }`}
                    >
                      {msg.type === "code" ? (
                        <CodeBlock code={msg.text} language="cpp" />
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
                            remarkPlugins={[[remarkGfm]]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Input stays at the bottom */}
          <div className=" max-w-4xl  bg-white lg:py-8 mx-auto bg-white w-full sticky bottom-0">
            <div className=" bg-gray-100  rounded-lg p-2 flex items-center  shadow-md">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
