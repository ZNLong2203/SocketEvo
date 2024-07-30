import Avatar from "../common/Avatar";
import React from "react";
import { BsFillChatLeftTextFill, BsThreeDotsVertical} from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";

const ChatListHeader = () => {
  const [{userInfo}, dispatch] = useStateProvider();
  return(
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.image}/>
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill 
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
        />
        <BsThreeDotsVertical 
          className="text-panel-header-icon cursor-pointer text-xl"
          title="More Options"
        />
      </div>
    </div>
  )
}

export default ChatListHeader;
