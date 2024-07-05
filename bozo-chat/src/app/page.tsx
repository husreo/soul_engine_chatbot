"use client"

import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
import Chatbox from "./components/chatbox";
import SimpleBar from 'simplebar-react';
import { Soul, said } from "@opensouls/engine";
import { Fragment, useEffect, useRef, useState } from "react";
import { useOnMount } from "@/lib/hooks/use-on-mount";
import { useRouter } from "next/navigation";
import Upload from "./components/upload";
export type ChatMessage =
  {
    state: number;
    content: string;
    urlname: string;
    urlcontent: string;
  }
export default function Home() {
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showMeme, setMeme] = useState(false);
  const [imgurl, setimgUrl] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const souls: Record<string, Soul> = {};
  const lastMessageTimestamps: Record<number, number> = {};
  const lastUserMessages: Record<number, string> = {};
  const lastBotMessages: Record<number, string> = {};
  const [soul, setSoul] = useState<Soul | null>(null);
  const router = useRouter()
  useEffect(() => {
    for (let index = 1; index <= 102; index++) {
      setimgUrl((prev) => [
        ...prev,
        `https://ipfs.io/ipfs/QmbmbFQsvEKi7nmcjaqfxmVaCFHBut7j9pQZr6axFNte7A/(${index}).jpeg`
      ])
    }
    setMessages([]);
    (async () => {
      console.log("call here!");
      
      const soul = await setupSoulBridge();
      soul.dispatch({
        action: "said",
        content: "Hello",
      });
      setSoul(soul);
    })()

  }, [])
  useEffect(() => {
    router.push(`#${messages.length-1}`);

  }, [messages])
  async function setupSoulBridge() {
    const soul = new Soul({
      organization: process.env.NEXT_PUBLIC_OPENSOULS_ORG!,
      blueprint: process.env.NEXT_PUBLIC_OPENSOULS_BLUEPRINT!,
    });

    soul.on("says", async (event) => {
      let content = await event.content();
      if (content.length > 4096) {
        content = content.substring(0, 4093) + '...';
      }
      setIsThinking(false);
      let phrase = "";
      let url = "";
      if (content.includes("http")) {
        const regex = /\[(.*?)\]\((https?:\/\/\S+)\)/;
        const match = content.match(regex);
        
        if (match) {
          phrase = match[1];
          url = match[2];

          content = content.replace(match[0], "");
          
        } else {
          console.log("No match found.");
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          state: 0,
          content,
          urlname: phrase,
          urlcontent: url
        },
      ]);
      
    });
    
    await soul.connect();
    return soul;
  }
  function sendMeme(url: string) {
    setMessages((prev) => [
      ...prev,
      {
        state: 2,
        content: url,
        urlname: '',
        urlcontent: ''
      },
    ]);
  }
  async function connectToSoulEngine(soulId: number, msg: string) {
      console.log("here", msg);
      if (msg === "/meme") {
        const randomNumber = Math.floor(Math.random() * 102) + 1;
        setMessages((prev) => [
          ...prev,
          {
            state: 3,
            content: imgurl[randomNumber],
            urlname: '',
            urlcontent: ''
          },
        ]);
        return
      }
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
      setMessages((prev) => [
        ...prev,
        {
          state: 1,
          content: msg,
          urlname: '',
          urlcontent: ''
        },
      ]);
      lastUserMessages[soulId] = msg; // Store the last message sent by the user
      if (soul) {
        soul.dispatch({
          action: "said",
          content: msg,
        });
        setIsThinking(true);
      }
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
  return <SimpleBar forceVisible="x" autoHide={true} className="w-full h-screen p-4 md:p-6">

      <div className="max-w-7xl mx-auto pt-[88px] pb-8 px-2 h-screen">

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
              <Image src="/img/graybozo.svg" width={20} height={20} className="w-full" alt="" />
              
              <div className="flex justify-between mt-2">
                <p className="text-[#8226BF]">You</p>
                <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-5/6 h-full flex flex-col justify-between gap-4 ">
            <div className="border-2 border-[#8226BF] h-5/6 rounded-md"  id="scroll">
              <SimpleBar forceVisible="x" autoHide={true} className="w-full h-full p-4 md:p-6">
              
                {
                  messages.map((val, index) => <div className="w-full py-3">

                    <div className={`flex w-full gap-1 md:gap-3 py-2 md:p-0 ${val.state ===1 || val.state === 2?`justify-end`:``}`} key = {index} id={index.toString()}>
                      {val.state === 0 || val.state === 3?<div className="text-[#8226BF]">Bozo</div>:''}

                      {val.state ===2?<img src = {val.content} className="w-[300px]"></img>: val.state ===3? <div className="w-full">
                        <div className="flex gap-1 md:gap-3 py-2 md:p-0 -z-50">
                          <img className="w-[300px]" src={val.content} alt="" />
                        </div>
                        <div className="flex justify-end gap-1 md:gap-3 py-2 md:p-0 -z-50">
                          <button onClick={() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                state: 0,
                                content: "Good feedback logged! Thanks! Enjoy meme 😁",
                                urlcontent: '',
                                urlname: ''
                              }
                            ])
                          }} className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]">That's pretty funny</button>
                          <button onClick={() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                state: 0,
                                content: "Bad feedback logged! Sorry about that! 😥",
                                urlcontent: '',
                                urlname: ''
                              }
                            ])
                          }} className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#4c4253] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]">nah, it's not funny at all</button>
                        </div>
                      </div>
                      :<Chatbox state={val.state} content = {val.content} urlname = {val.urlname} urlcontent = {val.urlcontent}/>}
                      {val.state ===1 || val.state ===2 ?<div className="text-[#8226BF]">You</div>:''}
                    </div>
                    {index === messages.length -1 && isThinking? 
                    <div className="relative inline-block p-3 md:p-5 px-4 mg:px-6 max-w-[400px]">
                      <div className="absolute inset-0">
                        <img src="/img/chatbox.png" className={`w-full h-full flip`} />
                      </div>
                      <p className="text-[14px] md:text-[16px] relative bg-transparent break-words overflow-wrap break-word">
                        ...
                      </p> 
                    </div> : ""
                    }
                    {index === 0? <div className="w-full h-[40px]">
                      <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "What's $bozo")}>What's $bozo</button>
                      <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[rgb(130,38,191)] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "Who are you")}>Who are you</button>
                      <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "Where to start")}>Where to start</button>
                      <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "Why invest in bozo")}>Why invest in bozo</button>
                    </div>:""}
                  </div>
                  )
                }
                
              </SimpleBar>
            </div>
            
            <div className="border-2 border-[#8226BF] rounded-md p-[24px]">
              <div className="flex justify-between items-center">
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
                  <img src="/img/memo.png" className="h-[30px] cursor-pointer" alt="" onClick={() => setMeme(!showMeme)} />
                </div>
              </div>
              {
                showMeme? <div className="w-full">
                  <SimpleBar forceVisible="x" autoHide={true} className="w-full h-[120px] p-4 md:p-6">

                    {imgurl.map((val, index) =>
                      <img src={val} className="w-[100px] float-left h-[100px] m-2 cursor-pointer" alt="" onClick={() => sendMeme(val)} />
                    )}
                  </SimpleBar>
                </div>:""
              }
              
            </div>
          </div>
        </div>
      </div>
    </SimpleBar>
}