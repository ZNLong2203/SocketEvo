import React, { useState, useEffect } from "react";
import axios from "axios";
import { GET_ALL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ChatListItem from "./ChatListItem";

const ContactsList = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();

  useEffect(() => {
     if(searchTerm.length > 0) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      setSearchContacts(filteredData);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await axios.get(GET_ALL_CONTACTS_ROUTE);
        setAllContacts(response.data.users);
        setSearchContacts(response.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 px-3 items-center gap-3 h-14 mx-2">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
            </div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => (
          <div key={initialLetter}>
            <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
            {userList.map((contact) => (
              <ChatListItem 
                key={contact.id}
                data={contact}
                isContactsPage={true}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
