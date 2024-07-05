import TextareaAutosize from 'react-textarea-autosize';

export default function Home() {
  return <div className=" h-screen">
    <div className="max-w-5xl mx-auto pt-[88px] px-2 h-full">
      <div className="flex justify-between gap-4 h-full flex-col md:flex-row">
        <div className="flex justify-between w-full md:w-[183px] flex-row md:flex-col">
          <div className="w-1/3 md:w-full">
            <img src="/img/bozo.svg" className="w-full" alt="" />
            <div className="flex justify-between mt-2">
              <p className="text-[#8226BF]">Bozo</p>
              <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
            </div>
          </div>
          <div className="w-1/3 md:w-full">
            <img src="/img/bozo.svg" className="w-full" alt="" />
            <div className="flex justify-between mt-2">
              <p className="text-[#8226BF]">Bozo</p>
              <button className="w-[50px] h-[24px] text-white bg-[#4CAF50] text-xs rounded-sm">ONLINE</button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/6 h-full flex flex-col justify-between gap-4">
          <div className="border-2 border-[#8226BF] h-5/6 rounded-md"></div>
          <div className="border-2 border-[#8226BF] rounded-md flex justify-between items-center p-[24px]">
            <TextareaAutosize className="h-[22px] w-5/6" maxRows={4} autoFocus />
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
