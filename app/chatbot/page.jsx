"use client";
import {useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import Image from "next/image";
import logo from "../assets/logo.png";
import logoLight from "../assets/logoLight.png";
import Chat from "../components/Chat";
import Swap from "../components/Swap";
import Menu from "../components/Menu";
import { useSession } from "next-auth/react";
import { Themes } from "../assets/Themes";
import Drawer from "../components/ReportScanner/Drawer";
import Alert from "../components/Alert";

async function readStream(response, setMessages) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = "";
  const id = Date.now().toString();

  // Insert an initial empty message for the streaming response.
  setMessages((prev) => [...prev, { id, role: "system", content: "" }]);

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("Stream finished");
      break;
    }
    const chunk = decoder.decode(value);
    console.log("Stream chunk:", chunk);
    accumulatedText += chunk;

    // Update the last message with the new accumulated text.
    setMessages((prev) => {
      if (prev.length === 0) {
        // Just in case, though we already added one.
        return [{ id, role: "system", content: accumulatedText }];
      }
      // Create a new message that updates the last message.
      const updatedMessage = {
        ...prev[prev.length - 1],
        content: accumulatedText,
      };
      return [...prev.slice(0, prev.length - 1), updatedMessage];
    });
  }

  return accumulatedText;
}

const createChat = (setCurrentChat, setMessages, user_id) => {
  fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user_id, label: "New Chat" }),
  })
    .then((res) => res.json())
    .then((res) => {
      setCurrentChat(res.id);
      setMessages([]);
    });
};

const createMessage = (role, message, chat_id) => {
  fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat_id, role: role, message: message }),
  }).then((res) => console.log(res.json()));
};
const getChats = (
  setChats,
  setCurrentChat,
  setMessages,
  user_id,
  setAlert,
  currentChat = null,
) => {
  fetch("/api/chats?user_id=" + user_id)
    .then((res) => res.json())
    .then((res) => {
      setChats(res.chats);
      if (res.chats.length > 0) {
        if (currentChat === null)
          updateMessages(res.chats[0]._id, setCurrentChat, setMessages);
      } else {
        createChat(setCurrentChat, setMessages, user_id);
      }
    }).catch(res => {
      setChats([]);
      setAlert({ Message :'somthing went wrong' , type : "alert-warning"});
    });
};

const updateMessages = async (chat_id, setCurrentChat, setMessages) => {
  try {
    setCurrentChat(chat_id);
    const response = await fetch(`/api/messages?chat_id=${chat_id}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    setMessages(
      data.map((msg) => ({
        id: msg._id,
        role: msg.role,
        content: msg.message,
        created_at: msg.created_at,
      }))
    );
    // setMessages(data.messages)
  } catch (error) {
    console.error(error);
  }
};

const updateChatLabel = async (chat_id, label) => {
  try {
    const response = await fetch(`/api/chats`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat_id, label: label }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error(error);
  }
};

function Page() {
  const chatRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const [ showLodingBubble, setShowLodingBubble] = useState(false);
  const [ConfirmedReport, setConfirmedReport] = useState("");
  const [theme, setTheme] = useState(Themes.dark);
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat({
    api: "/api/chat",
    onResponse: async (response) => {
      setShowLodingBubble(false);
      if (response.status !== 200) {
        console.log("Error:", response.statusText);
        return;
      }
      const message = await readStream(response, setMessages);
      createMessage("system", message, currentChat);
      updateChatLabel(currentChat, message.slice(0, 40));
      getChats(setChats, setCurrentChat, setMessages, session.user.id, 1);
    },
  });

  useEffect(() => {
    // createChat();

    if (status === "authenticated") {
      getChats(setChats, setCurrentChat, setMessages, session.user.id , setAlert);
    }
  }, [status]);

  useEffect(() => {
    ScrollDown();
  }, [messages]);
  const ScrollDown = () => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const toggleTheme = () => {
    setTheme(isDark ? Themes.light : Themes.dark);
    setIsDark(!isDark);
  };

  return (
    <div
      className={
        "w-full h-screen   flex flex-row relative " + theme.chatBackground
      }
    >
      {alert && <Alert message={alert.Message} setAlert={setAlert} type={alert.type} />}
      <nav>
        <Menu
          currentChat={currentChat}
          createChat={() =>
            createChat(setCurrentChat, setMessages, session.user.id)
          }
          updateMessages={(chat_id) =>
            updateMessages(chat_id, setCurrentChat, setMessages)
          }
          chats={chats}
          theme={theme}
        ></Menu>
      </nav>
      <main
        className={
          " gap-2 px-2 lg:px-[10%]  lg:w-[80%] pt-[5%] m-auto relative " + theme.chatBackground
        }
      >
        <Swap onclick={() => toggleTheme()}></Swap>
        {messages.length == 0 && (!isDark ? (
          <Image src={logoLight} alt="Logo" className="w-[20%]" width={200} />
        ) : (
          <Image src={logo} alt="Logo" className=" w-[20%]" width={200} />
        ))}
        { ConfirmedReport && <div className="toast  absolute left-0 top-1 h-fit  w-fit">
          <div className="alert  alert-success text-gray-800 px-2 py-1.5  font-semibold font-sans w-fit">
            
            <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
            </svg>
            <p>Repport Added</p>
            
          </div>
        </div>}
        <section className="h-full " ref={chatRef}>
          {/* Render Chat component only if there are messages */}
          {messages?.length > 0 ? (
            <Chat isLoading={showLodingBubble} theme={theme} messages={messages} />
          ) : (
            <div className="flex inline gap-2 flex-wrap justify-center mt-[10%]">
              <div
                className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer  text-semibold font-sans `}
              >
                <span>New mail arrived</span>
              </div>
              <div
                className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer text-semibold font-sans `}
              >
                <span>Message sent successfully</span>
              </div>
              <div
                className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer text-semibold font-sans `}
              >
                <span>Message sent successfully</span>
              </div>
              <div
                className={`w-fit ${theme.suggestionText} text-nowrap inline p-2 alert ${theme.suggestionBackground} select-none border-none cursor-pointer text-semibold font-sans `}
              >
                <span>
                  Message sent successfhgqshs jdezjgf ezjfghzef zegeg gf d ully
                </span>
              </div>
            </div>
          )}
        </section>

        <div className="flex gap-2 w-[80%] h-fit">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowLodingBubble(true);
              handleSubmit(e, { data: {ConfirmedReport: ConfirmedReport } });
              createMessage("user", input, currentChat);
            }}
            className={`flex gap-2 p-2 chat-form flex-col border-gray-600 rounded-lg ${theme.chatInputBackground}  justify-center border-2 w-full`}
          >
            <input
              className={
                " input  w-full  bg-transparent focus:outline-none overflow-break-all " +
                theme.inputText
              }
              type="text"
              onChange={handleInputChange}
              value={input}
              placeholder="Type your question ... "
            />
            <button
              type="submit"
              disabled={isLoading}
              className={
                " bg-gray-600 btn btn-outline font-semibold text-lg font-system  w-fit ml-auto text-black "
              }
            >
              {" "}
              {isLoading ? "Sending..." : "Send 🤞"}
            </button>
          </form>
          <Drawer setAlert={setAlert} setConfirmedReport={setConfirmedReport}></Drawer>
     

        </div>
      </main>
    </div>
  );
}

export default Page;
