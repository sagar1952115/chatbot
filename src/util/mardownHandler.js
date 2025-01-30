import { codeResponse, generalMarkDown, introductionMarkdown } from "@/data";

export function markDownManager(value) {
  if (value.toLowerCase().includes("code") || value.includes("```")) {
    return codeResponse;
  } else if (value.toLowerCase().includes("sagar")) {
    return introductionMarkdown;
  } else {
    return generalMarkDown;
  }
}
