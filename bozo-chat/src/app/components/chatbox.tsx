"use client"
import { useState } from "react";
export type UrlType =
  {
    name: string;
    content: string;
  }

export default function Chatbox(props: {content: String, state: Number, urlname: string, urlcontent: string}) {
  
    const currentTimeString = getCurrentTimeString();

    return <div className="flex flex-col">

      <div className="relative inline-block p-3 md:p-5 px-4 mg:px-6 max-w-[400px]">
        <div className="absolute inset-0">
          <img src="/img/chatbox.png" className={`w-full h-full ${props.state?"flip": ""}`} />
        </div>
        <p className="text-[14px] md:text-[16px] pl-4 relative bg-transparent break-words overflow-wrap break-word">
          {props.content}
        </p> 
      </div>
      {props.urlname !== ''?<div className={`w-full ${props.state?"hidden": ""}` }>
        <a className="p-1 mt-1 text-[12px] md:text-[14px] text-[#8226BF] border-[#8226BF] border-2 rounded-2xl float-left flex gap-1" href={props.urlcontent} target="_blank">{props.urlname} 
          <img src="/img/linkbtn.svg" alt="" />
        </a>
      </div>:""}
      <div className="w-full">
        <p className="text-[12px] text-[#7D7D7D]">Read {currentTimeString}</p>
      </div>
      
    </div>
}

export const getCurrentTimeString = () => {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}