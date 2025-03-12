'use client';
import { signOut } from "next-auth/react";
import DrawerOpener from "../components/DrawerOpener";
import Swap from "./Swap";


function Menu({ createChat, chats, updateMessages, currentChat , theme , setOpenDrawer}) {
  return (
    <>
      <ul className={"menu  w-[100%] h-screen pt-6 relative " + theme.menuBackground}>
        <DrawerOpener setOpenDrawer={setOpenDrawer} className=" sm:hidden absolute fixed top-0 right-[-45px] z-40"></DrawerOpener>
        <Swap className={"sm:hidden"}  onclick={() => toggleTheme()}></Swap>
      <li className={"mb-2 p-4  " + theme.menuSelected + " " + theme.menuSelectedText}>
        <a className={" font-semibold text-lg "+theme.menuHover} onClick={createChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            className="h-6 w-6"
            viewBox="0 0 32 32"
          >
            <g fill="none">
              <circle cx="16" cy="16" r="16" fill="#2E3148" />
              <g fill="#FFF" transform="translate(6 5)">
                <path d="M10.02.53c-1.295 0-2.345 4.697-2.345 10.49s1.05 10.49 2.345 10.49c1.294 0 2.344-4.697 2.344-10.49S11.314.53 10.02.53m.162 20.387c-.148.198-.297.05-.297.05c-.596-.692-.894-1.975-.894-1.975c-1.043-3.357-.795-10.564-.795-10.564c.49-5.721 1.382-7.073 1.685-7.373a.185.185 0 0 1 .238-.019c.44.313.81 1.617.81 1.617c1.09 4.048.991 7.848.991 7.848c.099 3.308-.546 7.01-.546 7.01c-.497 2.814-1.192 3.406-1.192 3.406" />
                <path d="M19.118 5.8c-.645-1.124-5.24.303-10.267 3.186S.278 15.116.921 16.24c.645 1.124 5.241-.303 10.268-3.186s8.574-6.131 7.93-7.254zM1.515 16.085c-.246-.03-.19-.234-.19-.234c.302-.86 1.266-1.758 1.266-1.758c2.393-2.575 8.769-5.946 8.769-5.946c5.206-2.422 6.823-2.32 7.233-2.208a.185.185 0 0 1 .135.198c-.05.537-1 1.507-1 1.507c-2.966 2.961-6.312 4.768-6.312 4.768c-2.82 1.732-6.353 3.013-6.353 3.013c-2.688.968-3.548.66-3.548.66" />
                <path d="M19.095 16.277c.65-1.12-2.887-4.383-7.898-7.288C6.187 6.085 1.593 4.641.944 5.763c-.65 1.123 2.888 4.383 7.9 7.288c5.013 2.904 9.602 4.348 10.251 3.226M1.375 6.196c-.097-.228.106-.283.106-.283c.897-.17 2.157.217 2.157.217c3.427.78 9.538 4.608 9.538 4.608c4.705 3.292 5.427 4.743 5.535 5.154a.185.185 0 0 1-.103.215c-.49.225-1.805-.11-1.805-.11c-4.05-1.086-7.289-3.075-7.289-3.075c-2.91-1.57-5.788-3.985-5.788-3.985c-2.187-1.842-2.35-2.74-2.35-2.74l-.002-.001z" />
                <circle cx="9.995" cy="10.995" r="1.234" />
                <circle cx="15.055" cy="6.256" r="1" />
                <circle cx="3.306" cy="8.774" r="1" />
                <circle cx="8.539" cy="17.856" r="1" />
              </g>
            </g>
          </svg>
          New Chat
        </a>
      </li>
      <div className="flex w-full flex-col">
        <div className={"divider text-md font-semibold " + theme.menuDivider }>Previews</div>
      </div>
      {chats.length == 0 ?
        <div className="text-center">
          <span className={"loading loading-ring loading-md " + theme.loadingState}></span>
        </div>
        : chats.map((chat, i) => (
          
        <li
          key={i}
          className={
            currentChat === chat._id
              ?  theme.menuSelected +" p-2 "+ theme.menuSelectedText
              : " p-2 "+theme.menuText
          }
        >
          <a
            className={"overflow-hidden "+theme.menuHover}
            onClick={() => updateMessages(chat._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.85 8.14c.39 0 .77.03 1.14.08C16.31 5.25 13.19 3 9.44 3c-4.25 0-7.7 2.88-7.7 6.43c0 2.05 1.15 3.86 2.94 5.04L3.67 16.5l2.76-1.19c.59.21 1.21.38 1.87.47c-.09-.39-.14-.79-.14-1.21c-.01-3.54 3.44-6.43 7.69-6.43M12 5.89a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92M6.87 7.82a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92"
              />
              <path
                fill="currentColor"
                d="M22.26 14.57c0-2.84-2.87-5.14-6.41-5.14s-6.41 2.3-6.41 5.14s2.87 5.14 6.41 5.14c.58 0 1.14-.08 1.67-.2L20.98 21l-1.2-2.4c1.5-.94 2.48-2.38 2.48-4.03m-8.34-.32a.96.96 0 1 1 .96-.96c.01.53-.43.96-.96.96m3.85 0a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92"
              />
            </svg>
            <p className="text-nowrap overflow-hidden">{chat.label}</p>
          </a>
        </li>
      ))}



      <div className="flex w-full flex-col">
        <div className={"divider "+theme.menuDivider}></div>
      </div>
      <li className={"mt-auto mb-5 p-2 "+theme.menuText }>
          <button className={ theme.menuHover} onClick={()=>document.getElementById('my_modal_1').showModal()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path
                fill="currentColor"
                d="m2 12l-.78-.625l-.5.625l.5.625zm9 1a1 1 0 1 0 0-2zM5.22 6.375l-4 5l1.56 1.25l4-5zm-4 6.25l4 5l1.56-1.25l-4-5zM2 13h9v-2H2z"
              />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M10 8.132v-.743c0-1.619 0-2.428.474-2.987s1.272-.693 2.868-.96l1.672-.278c3.243-.54 4.864-.81 5.925.088C22 4.151 22 5.795 22 9.082v5.835c0 3.288 0 4.932-1.06 5.83c-1.062.9-2.683.63-5.926.089l-1.672-.279c-1.596-.266-2.394-.399-2.868-.958C10 19.039 10 18.229 10 16.61v-.545"
              />
            </g>
          </svg>
          Logout
        </button>
      </li>
      
      </ul>
      
      <dialog id="my_modal_1" className="modal">
  <div className={"modal-box  top-0 left-0 right-0 bottom-0 "+ theme.logoutModal}>
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Are you sure you want to logout?</p>
          <div className="modal-action">
          <button className={"btn border-none "+ theme.logoutModalButton} onClick={()=>signOut()}>Sign Out</button>

      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
              <button className={"btn border-none "+ theme.logoutModalButton}>Close</button>
      </form>
    </div>
  </div>
</dialog>
    </>
  );
}

export default Menu;
