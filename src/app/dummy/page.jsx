import { markdownContent } from "@/data";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const page = () => {
  return (
    <div>
      <ReactMarkdown className="prose" rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default page;
