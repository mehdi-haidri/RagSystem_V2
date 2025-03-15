"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import Image from "next/image";
import logo from "../assets/logo.png";
import send2 from "../assets/send2.svg";
import logoLight from "../assets/logoLight.png";
import Chat from "../components/Chat";
import Swap from "../components/Swap";
import Menu from "../components/Menu";
import { useSession } from "next-auth/react";
import { Themes } from "../assets/Themes";
import Drawer from "../components/ReportScanner/Drawer";
import Alert from "../components/Alert";
import NewChatPlaceHolder from "../components/NewChatPlaceHolder";

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

const createChat = async (setCurrentChat, setMessages, user_id) => {
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
const getChats = async (
  setChats,
  setCurrentChat,
  setMessages,
  user_id,
  setAlert,
  currentChat = null
) => {
  try {
    const res = await fetch("/api/chats?user_id=" + user_id);
    const data = await res.json();

    setChats(data.chats);

    if (data.chats.length > 0) {
      if (currentChat === null) {
        updateMessages(data.chats[0]._id, setCurrentChat, setMessages);
      }
    } else {
      console.log("No chats found");

      // 🛑 Prevent duplicate chat creation
      const newChatRes = await fetch("/api/chats?user_id=" + user_id);
      const newChatData = await newChatRes.json();

      if (newChatData.chats.length === 0) {
        await createChat(setCurrentChat, setMessages, user_id);
      }
    }
  } catch (error) {
    setChats([]);
    setAlert({ Message: "Something went wrong", type: "alert-warning" });
  }
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
  const [showLodingBubble, setShowLodingBubble] = useState(false);
  const [ConfirmedReport, setConfirmedReport] = useState("");
  const [theme, setTheme] = useState(Themes.dark);
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
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
      setTheme(Themes[session.user.theme])
      setIsDark(session.user.theme === "dark");

        getChats(
        setChats,
        setCurrentChat,
        setMessages,
        session.user.id,
        setAlert
      );
    }
  }, [session?.user?.id]);

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
      {alert && (
        <Alert message={alert.Message} setAlert={setAlert} type={alert.type} />
      )}
      <nav
        className={`  w-[300px] fixed top-0 left-0 z-40  sm:w-[350px] h-screen transition-transform    sm:translate-x-0 ${
          openDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Menu
          currentChat={currentChat}
          createChat={() =>
            createChat(setCurrentChat, setMessages, session.user.id)
          }
          updateMessages={(chat_id) =>
            updateMessages(chat_id, setCurrentChat, setMessages)
          }
          toggleTheme={toggleTheme}
          chats={chats}
          theme={theme}
          isDark={isDark}
          session={session}
          setOpenDrawer={setOpenDrawer}
        ></Menu>
      </nav>
      <main
        className={
          " gap-2 px-2 lg:px-[10%] w-full  sm:w-[calc(100% - 350px] pt-[5%] sm:ml-[350px] relative " +
          theme.chatBackground
        }
      >
        <Swap
          className={"hidden sm:block absolute right-10 top-10 "}
          onclick={() => toggleTheme()}
          session={session}
          isDark={isDark}
        ></Swap>
        {messages.length == 0 &&
          (!isDark ? (
            <Image src={logoLight} alt="Logo" className="w-[20%]" width={200} />
          ) : (
            <Image src={logo} alt="Logo" className=" w-[20%]" width={200} />
          ))}
        {ConfirmedReport && (
          <div className="toast  absolute left-0 top-1 h-fit  w-fit">
            <div className="alert  alert-success text-gray-800 px-2 py-1.5  font-semibold font-sans w-fit">
              <svg
                className="w-4 h-4 text-gray-800 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
              <p>Repport Added</p>
            </div>
          </div>
        )}
        <section className="h-full " ref={chatRef}>
          {/* Render Chat component only if there are messages */}
          {messages?.length > 0 ? (
            <Chat
              isLoading={showLodingBubble}
              theme={theme}
              messages={messages}
            />
          ) : (
            <NewChatPlaceHolder theme={theme}></NewChatPlaceHolder>
          )}
        </section>

        <div className="flex gap-2  w-full sm:w-[80%] h-fit">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowLodingBubble(true);
              handleSubmit(e, { data: { ConfirmedReport: ConfirmedReport } });
              createMessage("user", input, currentChat);
            }}
            className={`flex flex-1 gap-2 p-2 chat-form flex-col border-gray-600 rounded-lg ${theme.chatInputBackground}  justify-center border-2 w-full`}
          >
            <textarea
              className={
                "input w-full bg-transparent focus:outline-none focus:ring-0 overflow-break-all border-0 outline-none resize-none " +
                theme.inputText
              }
              onChange={handleInputChange}
              value={input}
              placeholder="Type your question ..."
              rows={2} // Set the initial number of visible lines
            ></textarea>
            <button
              type="submit"
              disabled={isLoading}
              className={
                " bg-gray-600 btn  rounded-full      ml-auto " + theme.suggestionBackground
              }
            >
              {" "}
              {isLoading ? (
                <svg width={15} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.128"></g><g id="SVGRepo_iconCarrier"> <rect x="1" y="1" width="15" height="15" fill="#ffff"></rect> </g></svg>) :
                (<Image src={send2} alt="send" width={25}></Image>)
               
              }
            </button>
          </form>
          <Drawer
            theme={theme}
            setAlert={setAlert}
            setConfirmedReport={setConfirmedReport}
          ></Drawer>
        </div>
      </main>
    </div>
  );
}

export default Page;
