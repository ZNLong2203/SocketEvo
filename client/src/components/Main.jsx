import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Router from "next/router";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { onAuthStateChanged } from "firebase/auth";
import firebaseAuth from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants"; 
import io from "socket.io-client";

const Main = () => {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) {
        setRedirectLogin(true);
      } else {
        if (!userInfo && currentUser.email) {
          try {
            const response = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });
            if (response.data.user === null) {
              dispatch({
                type: reducerCases.SET_NEW_USER,
                newUser: true,
              });
              dispatch({
                type: reducerCases.SET_USER_INFO,
                userInfo: {
                  displayName: currentUser.displayName,
                  email: currentUser.email,
                  photoUrl: currentUser.photoURL,
                  status: "",
                },
              });
              Router.push('/profile');
            } else {
              dispatch({
                type: reducerCases.SET_NEW_USER,
                newUser: false,
              });
              dispatch({
                type: reducerCases.SET_USER_INFO,
                userInfo: response.data.user,
              });
            }
          } catch (error) {
            console.error("Error checking user:", error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (redirectLogin) {
      Router.push('/login');
    }
  }, [redirectLogin]);

  useEffect(() => {
    if(userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({
        type: reducerCases.SET_SOCKET,
        socket,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if(socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessages: data.message,
        });
      })
      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async (req, res, next) => {
      const response = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`);
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages: response.data.messages,
      });
    }
    if(currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <div className="grid grid-cols-3 h-screen w-screen max-h-screen max-w-full overflow-hidden">
      <ChatList />
      {
        currentChatUser ? <Chat /> : <Empty />
      }
      <Chat />
    </div>
  );
};

export default Main;
