"use client";


function LoadingChat({ messages, theme }) {
  return (
    <>
       <div className=" rounded-md c p-4 chat chat-start  animate-pulse">
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

        <div className=" rounded-md c p-4 chat chat-end   animate-pulse">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
          <div className="size-10 rounded-full bg-gray-200"></div>
          </div>
        </div>
            <div className=" chat-bubble flex  w-[40%] space-x-4">
              <div className="flex-1 space-y-6 py-1">
              <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 h-2 rounded bg-gray-200"></div>
                    <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                  </div>
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
      

    </>
  );
}

export default LoadingChat;
