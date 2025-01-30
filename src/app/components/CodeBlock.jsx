import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, language = "cpp" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative  rounded-lg overflow-hidden  ">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-5 z-30 right-5 text-gray-400 hover:text-white text-sm"
      >
        {copied ? "✔ Copied" : "📋 Copy"}
      </button>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter customStyle={{borderRadius:"12px",zIndex:0,position:"relative"}} language={language} style={materialOceanic} wrapLongLines>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
