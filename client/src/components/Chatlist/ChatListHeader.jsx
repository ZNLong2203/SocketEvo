import Avatar from "../common/Avatar";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

const ChatListHeader = () => {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [showMenu, setShowMenu] = useState(false);

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,
    });
  };

  const handleLogOut = () => {
    dispatch({
      type: reducerCases.SET_USER_INFO,
      userInfo: null,
    });
    Router.push("/login");
  };

  const toggleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setShowMenu((prev) => !prev);
  };

  const hideContextMenu = (e) => {
    if (e.target.closest("#context-menu") === null) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideContextMenu);
    return () => {
      document.removeEventListener("click", hideContextMenu);
    };
  }, []);

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center relative">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.image} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="More Options"
          onClick={(e) => toggleContextMenu(e)}
        />
      </div>
      {showMenu && (
        <div
          id="context-menu"
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10 rounded"
        >
          <div
            className="bg-slate-500 hover:bg-slate-400 cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={handleLogOut}
          >
            Log Out
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListHeader;
