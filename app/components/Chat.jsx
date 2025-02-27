'use client'

import Image from "next/image"
import AiImage from "../assets/Ai.jpg"
import MarkDown from "./MarkDown"



function Chat({ messages , theme}) {
  
  return (
    <>
 
      
      {messages.map((message,i) => {
        return message.role == "system" ?
          (<div key={i} className={"chat chat-start "}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
              <Image
                src={AiImage}
                alt="tttt"
              ></Image>
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
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
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

      </>
  )
}

export default Chat