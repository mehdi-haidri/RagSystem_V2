'use client'

import NextImage from "next/image"
import AiImage from "../assets/Ai.jpg"
import Dumy from "../assets/dumy.jpg"
import MarkDown from "./MarkDown"
import { useSession } from "next-auth/react"

import { useEffect , useState} from "react"



function Chat({ messages , theme , isLoading }) {
  const { data: session, status } = useSession()
  const [userPic, setUserPic] = useState(null)
  useEffect(() => {
  
      console.log(session);
    if (session) {
        
      const image = new Image();
      image.src = session.user.image
      
      image.onload = () => {
        setUserPic(
          image );
      };
    }
    
  },[status ,session])
  return (
    <>
 
      {messages.map((message,i) => {
        return message.role == "system" ?
          (<div key={i} className={"chat chat-start "}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
              <NextImage
                src={AiImage}
                alt="tttt"
              ></NextImage>
              </div>
            </div>
            <div className="chat-header">
             <p className="font-semibold mr-2 inline">Ai</p> 
            <time className="text-xs opacity-50">{new Date(message.created_at).getHours()} : {new Date(message.created_at).getMinutes()}</time>
            </div>
            <div className={theme.chatBuble + " chat-bubble "}>
              <MarkDown text={message.content}></MarkDown>
          </div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>)
      :
          (<div key={i} className={"chat chat-end "}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <NextImage
                  alt="Tailwind CSS chat bubble component"
                  src={userPic != null ? userPic : Dumy} />
              </div>
            </div>
            <div className="chat-header">
            <p className="font-semibold mr-2 inline">Ai</p> 
              <time className="text-xs opacity-50">{new Date(message.created_at).getHours()} : {new Date(message.created_at).getMinutes()}</time>
            </div>
            <div className={ theme.chatBuble +" chat-bubble " + theme.chatText}> {message.content}</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>)
                      
            })
      }
      {/* <LoadingChat></LoadingChat> */}

      {isLoading &&  <div className=" rounded-md c p-4 chat chat-start  animate-pulse">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
          <div className="size-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
            <div className=" chat-bubble flex w-[40%]  space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                    <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-2 rounded bg-gray-200"></div>
                </div>
            </div>
          </div>
        </div>
}


      </>
  )
}

export default Chat