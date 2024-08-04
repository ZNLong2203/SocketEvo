import React from "react";
import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import { HOST } from "@/utils/ApiRoutes";
import MessageStatus from "./MessageStatus";
import ImageMessage from "./ImageMessage";

const ChatContainer = () => {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  // Filter out undefined messages
  const validMessages = messages.filter((message) => message !== undefined);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-4 my-2 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto mt-2">
            {validMessages.map((message) => (
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
                    className={`py-2 px-4 text-white text-sm rounded-md flex gap-2 items-end max-w-[45%] 
                    ${
                      message.sender_id === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.messages}</span>
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
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && (
                  <div
                    className={`py-2 px-4 text-white text-sm rounded-md flex gap-2 items-end max-w-[45%] 
                    ${
                      message.sender_id === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <audio controls>
                      <source src={`${HOST}/${message.messages}`} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
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
