import React from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

const ChatHeader = () => {
  const [{currentChatUser}, dispatch] = useStateProvider();
  return(
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="div flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.image}/>
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {currentChatUser?.name}
          </span>
          <span className="text-secondary text-sm">
            Online/Offline
          </span>
        </div>
      </div>
      <div>
        <div className="flex gap-6">
          <MdCall 
            className="text-panel-header-icon cursor-pointer text-xl"
          />
          <IoVideocam 
            className="text-panel-header-icon cursor-pointer text-xl"
          />
          <BiSearchAlt2 
            className="text-panel-header-icon cursor-pointer text-xl"
            onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
          />
          <BsThreeDotsVertical 
            className="text-panel-header-icon cursor-pointer text-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default ChatHeader;
