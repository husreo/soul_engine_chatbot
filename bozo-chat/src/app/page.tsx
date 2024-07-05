"use client"

import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
import Chatbox from "./components/chatbox";
import SimpleBar from 'simplebar-react';
import { Soul, said } from "@opensouls/engine";
import { Fragment, useRef, useState } from "react";
import { useOnMount } from "@/lib/hooks/use-on-mount";

type msgType = {
  content: String,
  state: Number
}

export type ChatMessage =
  {
    state: number;
    content: string;
  }
export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [usermsg, setUsermsg] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const souls: Record<string, Soul> = {};
  const lastMessageTimestamps: Record<number, number> = {};
  const lastUserMessages: Record<number, string> = {};
  const lastBotMessages: Record<number, string> = {};

  async function setupSoulBridge(soulId: number) {
    
    if (souls[soulId]) {
      return souls[soulId];
    }
    console.log("blueprint ==>>>", process.env.NEXT_PUBLIC_OPENSOULS_BLUEPRINT);
    
    const soul = new Soul({
      soulId: String(soulId),
      organization: process.env.NEXT_PUBLIC_OPENSOULS_ORG!,
      blueprint: process.env.NEXT_PUBLIC_OPENSOULS_BLUEPRINT!,
    });


    soul.on("says", async (event) => {
      let content = await event.content();
      if (content.length > 4096) {
        content = content.substring(0, 4093) + '...';
      }
      console.log("result ===>>>", content);
      
      setMessage(content);
      lastBotMessages[soulId] = content; // Store the last message sent by the bot
    });
    
    await soul.connect();
    
    console.log(`Connected to ${String(soulId)}`)
    souls[soulId] = soul;

    return soul;
  }
  
  async function connectToSoulEngine(soulId: number, msg: string) {
      console.log("here", msg);
      
      setUsermsg(msg);
      // const telegramChatId = ctx.message.chat.id;
      const currentTimestamp = Date.now();
  
      if (lastMessageTimestamps[soulId]) {
        const timeSinceLastMessage = currentTimestamp - lastMessageTimestamps[soulId];
        const remainingTime = Math.ceil((10000 - timeSinceLastMessage) / 1000);
  
        // if (timeSinceLastMessage < 10000) {
        //   await ctx.reply(`Please wait ${remainingTime} seconds before sending another message!`);
        //   return;
        // }
      }
  
      lastMessageTimestamps[soulId] = currentTimestamp;
  
      const soul = await setupSoulBridge(soulId); 
  
      // if (messageText.includes("👍")) {
      //   await ctx.reply("Good feedback logged! Thanks!");
      //   const logMessage = `GOOD FEEDBACK RECEIVED!\nUser Question: ${lastUserMessages[telegramChatId]}\nChadbot Answer: ${lastBotMessages[telegramChatId]}`;
      //   await sendLogToChat(telegram, logMessage);
      //   await logFeedback(messageText, telegramChatId, "good", lastUserMessages[telegramChatId], lastBotMessages[telegramChatId]);
      // } else if (messageText.includes("👎")) {
      //   await ctx.reply("Bad feedback logged! Thanks!");
      //   const logMessage = `BAD FEEDBACK RECEIVED!\nUser Question: ${lastUserMessages[telegramChatId]}\nChadbot Answer: ${lastBotMessages[telegramChatId]}`;
      //   await sendLogToChat(telegram, logMessage);
      //   await logFeedback(messageText, telegramChatId, "bad", lastUserMessages[telegramChatId], lastBotMessages[telegramChatId]);
      // } else {
      lastUserMessages[soulId] = msg; // Store the last message sent by the user
      soul.dispatch({
        action: "said",
        content: msg,
      });
  }

  function disconnectInactiveSouls() {
    const now = Date.now();
    const inactivityLimit = 3 * 60 * 1000; // 3 minutes
  
    for (const [chatId, soul] of Object.entries(souls)) {
      const lastActivity = lastMessageTimestamps[Number(chatId)];
      if (now - lastActivity > inactivityLimit) {
        soul.disconnect();
        delete souls[chatId];
        console.log(`Disconnected soul for chat ID ${chatId} due to inactivity.`);
      }
    }
  }
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
                <Chatbox state={0} chatContent = {message}/>
              </div>
              <div className="flex justify-end gap-1 md:gap-3 py-2 md:p-0">
                <Chatbox state={1} chatContent = {usermsg}/>
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
            <TextareaAutosize
              name = "bozouser"
              className="h-[22px] w-5/6 focus:outline-none"
              maxRows={4}  
              onKeyDown={(e) => {
                
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  
                  connectToSoulEngine(12345, e.currentTarget.value);
                }
              }}
              autoFocus />
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