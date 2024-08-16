import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatListItem from "./ChatListItem";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

const List = () => {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await axios.get(
          `${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`
        );
        const { users, onlineUsers } = res.data;
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users,
        });
      } catch (err) {
        console.error("Error getting contacts:", err);
      }
    };
    if (userInfo?.id) getContacts();
  }, [userInfo]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))
        : userContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))}
    </div>
  );
};

export default List;
