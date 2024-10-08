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
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingVoiceCall from "./common/IncomingVoiceCall";

const Main = () => {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [
    {
      userInfo,
      currentChatUser,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider();
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (currentUser) => {
        if (!currentUser) {
          setRedirectLogin(true);
        } else {
          if (!userInfo && currentUser.email) {
            try {
              const response = await axios.post(CHECK_USER_ROUTE, {
                email: currentUser.email,
              });
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
                Router.push("/profile");
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
      }
    );

    return () => unsubscribe();
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (redirectLogin) {
      Router.push("/login");
    }
  }, [redirectLogin]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({
        type: reducerCases.SET_SOCKET,
        socket,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessages: data.message,
        });
      });
      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: {
            ...from,
            roomId,
            callType,
          },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: {
            ...from,
            roomId,
            callType,
          },
        });
      });

      socket.current.on("reject-voice-call", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("reject-video-call", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async (req, res, next) => {
      const response = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      );
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages: response.data.messages,
      });
    };
    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingVoiceCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
};

export default Main;
