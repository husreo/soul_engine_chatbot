"use client"

import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
import Chatbox from "./components/chatbox";
import { useState } from "react";
import SimpleBar from 'simplebar-react';
type msgType = {
  content: String,
  state: Number
}

export default function Home() {

  const [msgs, setMsg] = useState<msgType[] | null>([]);
  return <div className=" h-screen">
    <div className="max-w-7xl mx-auto pt-[88px] pb-8 px-2 h-full">
      <div className="flex justify-between gap-4 h-full flex-col md:flex-row">
        <div className="flex justify-between w-full md:w-[183px] flex-row md:flex-col">
          <div className="w-1/3 md:w-full">
            <Image src="/img/bozo.svg" width={20} height={20} className="w-full" alt="" />
            <div className="flex justify-between mt-2">
              <p className="text-[#8226BF]">Bozo</p>
              <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
            </div>
          </div>
          <div className="w-1/3 md:w-full">
            <Image src="/img/bozo.svg" width={20} height={20} className="w-full" alt="" />
            
            <div className="flex justify-between mt-2">
              <p className="text-[#8226BF]">You</p>
              <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/6 h-full flex flex-col justify-between gap-4 ">
          <div className="border-2 border-[#8226BF] h-5/6 rounded-md">
            <SimpleBar forceVisible="x" autoHide={true} className="w-full h-full p-4 md:p-6">
              <div className="flex gap-1 md:gap-3 py-2 md:p-0">
                <div className="text-[#8226BF]">Bozo</div>
                <Chatbox state={0} chatContent = "Yo I just saw something really sleek that I thought you might like a lot"/>
              </div>
              <div className="flex justify-end gap-1 md:gap-3 py-2 md:p-0">
                <Chatbox state={1} chatContent = "Where to start"/>
                <div className="text-[#8226BF]">You</div>
              </div>
              <div className="flex gap-1 md:gap-3 py-2 md:p-0 -z-50">
                <img src="/img/meme.png" alt="" />
              </div>
              <div className="flex justify-end gap-1 md:gap-3 py-2 md:p-0 -z-50">
                <div className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7]">That's pretty funny</div>
                <div className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7]">nah, it's not funny at all</div>

              </div>
            </SimpleBar>
          </div>
          
          <div className="border-2 border-[#8226BF] rounded-md flex justify-between items-center p-[24px]">
            <TextareaAutosize className="h-[22px] w-5/6 focus:outline-none" maxRows={4} autoFocus />
            <div className="flex items-center gap-2">

              <button className="w-[50px] h-[40px] text-white bg-[#8226BF] text-xs rounded-sm">SEND</button>
              <img src="/img/memo.png" className="h-[30px]" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
