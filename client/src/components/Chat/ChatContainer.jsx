import React from "react";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "./MessageStatus";

const ChatContainer = () => {
  const [{ messages, currentChatUser, userInfo }, dispatch] =
    useStateProvider();
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-4 my-2 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto mt-2">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                } gap-2`}
              >
                {message.type === "text" && (
                  <div
                    className={`py-2 px-4 rounded-lg text-white text-sm rounded-md flex gap-2 items-end max-w-[45%] 
                    ${
                      message.sender_id === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end"> 
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.sender_id === userInfo.id && (
                          <MessageStatus messageStatus={message.messageStatus} />
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
