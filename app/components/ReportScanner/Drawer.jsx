"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import ReportText from "./ReportText";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";

function Drawer({ setConfirmedReport, setAlert , theme}) {
  const [open, setOpen] = useState(false);
  const [base64String, setBase64Data] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleImageExtraction = async () => {
    setIsLoading(true);
    if (!base64String) {
      alert("Please upload an image first");
      setIsLoading(false);
      return
    }
    console.log(base64String);

    try {
        
      const response = await fetch("/api/ImageExtractor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image : base64String }),
      })

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setReportData(data)
      }catch (error) {
        setAlert({ Message :'Somthing went wrong' , type : 'warnning'});
      }
      setIsLoading(false);


  }

  return (
    <>
      <div className="text-center">
      
        <Button  onClick={() => setOpen(true)}
          className={` ${theme.menuText} bg-gray-700 hover:bg-gray-200 ${theme.menuBackground}  font-semibold rounded-lg text-lg p-3 py-5 outline-none  border-0`}
          type="button"
          data-drawer-target="drawer-right-example"
          data-drawer-show="drawer-right-example"
          data-drawer-placement="right"
          aria-controls="drawer-right-example"
          variant="outline" >
          
            <p className="hidden sm:block">  Scanner  </p>  

      <SparklesIcon className=" ml-1  opacity-90" size={16} aria-hidden="true" />
    </Button>
      </div>

      <div
        id="drawer-right-example"
        className={`fixed ${theme.menuBackground} top-0 right-0 z-40 h-screen p-4 overflow-y-auto ${
          !open ? "translate-x-full" : ""
        } transition-transform    w-[70%] sm:w-[40%] dark:bg-gray-800" tabIndex="-1" aria-labelledby="drawer-right-label`}
      >
        <button
          onClick={() => setOpen(false)}
          type="button"
          data-drawer-hide="drawer-right-example"
          aria-controls="drawer-right-example"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8   inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <h5
          id="drawer-right-label"
          className=" top-2.5 end-2.5 absolute inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            className="w-4 h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          Report Analyzer
        </h5>

        
        <ImageUpload setAlert={setAlert} setBase64Data={setBase64Data}></ImageUpload>

        <div className="grid  w-full">
         <button
            onClick={()=>{ handleImageExtraction()}}
            className={`px-4 w-full py-2 ${isLoading && 'py-0' } text-lg   font-semibold text-center ${theme.chatText} ${theme.chatBackground} border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-200 hover:text-gray-800  `}
          >
            {isLoading ? <span className="loading loading-infinity loading-lg p-0"></span> : "Analyze"}
          </button>  
        </div>
        <ReportText theme={theme} setConfirmedReport={setConfirmedReport} reportData={reportData} setReportData={setReportData}></ReportText>
      </div>
    </>
  );
}

export default Drawer
