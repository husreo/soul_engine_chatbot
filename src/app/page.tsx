"use client"

import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
import Chatbox from "./components/chatbox";
import SimpleBar from 'simplebar-react';
import { Soul, said } from "@opensouls/engine";
import { Fragment, useEffect, useRef, useState } from "react";
import { useOnMount } from "@/lib/hooks/use-on-mount";
import { Header } from "./components/header";
import { useRouter } from "next/navigation";
import Upload from "./components/upload";
export type UrlType = {
  text: string;
  url: string;
}
export type ChatMessage =
  {
    state: number;
    content: string;
    urls: UrlType[];
  }
export default function Home() {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
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
    router.push(`#${messages.length - 1}`);
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
      console.log("result:", content);
      
      setIsThinking(false);
      let getUrls:UrlType[];
      if (content.includes("http")) {
        const urlRegex = /\[(.*?)\]\((.*?)\)/g;
        const matches = content.matchAll(urlRegex);
        getUrls = Array.from(matches, (match) => ({
          text: match[1],
          url: match[2]
        }));
        content = content.replace(urlRegex, '');
      }
      setMessages((prev) => [
        ...prev,
        {
          state: 0,
          content,
          urls: getUrls,
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
        urls: [],
      },
    ]);
  }
  async function connectToSoulEngine(soulId: number, msg: string) {
    setMessage('');
    console.log("here", msg);
    if (msg === "/meme") {
      const randomNumber = Math.floor(Math.random() * 102) + 1;
      setMessages((prev) => [
        ...prev,
        {
          state: 3,
          content: imgurl[randomNumber],
          urls: [],
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
        urls: [],
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
  return <div className="h-screen">
    <div className="max-w-7xl pt-[88px] h-full mx-auto pb-8 px-2 flex justify-start md:justify-between gap-4 flex-col sm:flex-row overflow-auto">
      {/* <SimpleBar forceVisible="x" autoHide={true} className="w-full h- p-4 md:p-6"> */}
      <div className="flex justify-between flex-row sm:flex-col">
        <div className="">
          <img src="/img/bozo.svg" className="h-[100px] sm:h-[150px]"  alt="" />
          <div className="flex justify-between mt-2">
            <p className="text-[#8226BF]">Bozo</p>
            <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
          </div>
        </div>
        <div className="">
          <img src="/img/graybozo.svg" className="h-[100px] sm:h-[150px]" alt="" />

          <div className="flex justify-between mt-2">
            <p className="text-[#8226BF]">You</p>
            <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-4/5 max-h-[100vh] flex flex-col justify-between gap-4 ">
        <div className="border-2 border-[#8226BF] h-[70vh] rounded-md " id="scroll" 
        style={{
          maxHeight: `calc(70vh - ${showMeme ? '120px' : '0px'})`
        }}>
          <SimpleBar forceVisible="x" autoHide={true} className="w-full h-full p-4 md:p-6">

            {
              messages.map((val, index) => <div className={`w-full py-3 ${index === 1? `hidden`: ``}`}>

                <div className={`flex w-full gap-1 md:gap-3 py-2 md:p-0 ${val.state === 1 || val.state === 2 ? `justify-end` : ``}`} key={index} id={index.toString()}>
                  {val.state === 0 || val.state === 3 ? <div className="text-[#8226BF]">Bozo</div> : ''}

                  {val.state === 2 ? <img src={val.content} className="w-[300px]"></img> : val.state === 3 ? <div className="w-full">
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
                            urls: [],
                          }
                        ])
                      }} className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]">That's pretty funny</button>
                      <button onClick={() => {
                        setMessages((prev) => [
                          ...prev,
                          {
                            state: 0,
                            content: "Bad feedback logged! Sorry about that! 😥",
                            urls: [],
                          }
                        ])
                      }} className="px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#4c4253] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]">nah, it's not funny at all</button>
                    </div>
                  </div>
                    : <Chatbox state={val.state} content={val.content} urls={val.urls} />}
                  {val.state === 1 || val.state === 2 ? <div className="text-[#8226BF]">You</div> : ''}
                </div>
                {index === messages.length - 1 && isThinking ?
                  <div className="relative inline-block p-3 md:p-5 px-4 mg:px-6 max-w-[400px]">
                    <div className="absolute inset-0">
                      <img src="/img/chatbox.png" className={`w-full h-full`} />
                    </div>
                    <p className="text-[14px] md:text-[16px] relative bg-transparent break-words overflow-wrap">
                      ...
                    </p>
                  </div> : ""
                }
                {index === 0 ? <div className="w-full h-[40px]">
                  <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "What's $bozo")}>How to buy $bozo</button>
                  <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[rgb(130,38,191)] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "Tell me a random fact about yourself")}>Tell me a random fact about yourself</button>
                  <button className="float-right ml-1 px-3 text-[14px] md:text-[16px] py-2 rounded-md border-2 border-[#8226BF] text-[#8226BF] bg-[#E9D4F7] hover:bg-[#efdffa]" onClick={() => connectToSoulEngine(12345, "Who are you?")}>Who are you?</button>
                </div> : ""}
              </div>
              )
            }

          </SimpleBar>
        </div>

        <div className="border-2 border-[#8226BF] max-h-[40vh]  rounded-md p-[24px]">
          <div className="flex justify-between items-center">
            < TextareaAutosize
              name="bozouser"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              className="h-[22px] w-5/6 focus:outline-none"
              maxRows={4}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  setMessage('');
                  e.preventDefault();
                  connectToSoulEngine(12345, e.currentTarget.value);
                }
              }}
              autoFocus />
            <div className="flex items-center gap-2">
              <button className="w-[50px] h-[40px] text-white bg-[#8226BF] text-xs rounded-sm" onClick={() => connectToSoulEngine(12345, message!)}>SEND</button>
              <img src="/img/memo.png" className="h-[30px] cursor-pointer" alt="" onClick={() => setMeme(!showMeme)} />
            </div>
          </div>
          {
            showMeme ?
              <SimpleBar forceVisible="x" autoHide={true} className="w-full h-[120px] p-4 md:p-6">
                {imgurl.map((val, index) =>
                  <img src={val} className="w-[100px] float-left h-[100px] m-2 cursor-pointer" alt="" onClick={() => sendMeme(val)} />
                )}
              </SimpleBar>
              : ""
          }

        </div>
      </div>
    </div >
    {/* </SimpleBar> */}
  </div >
}