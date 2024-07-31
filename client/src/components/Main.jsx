import React, { useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { onAuthStateChanged } from "firebase/auth";
import firebaseAuth from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants"; 

const Main = () => {
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [{ userInfo }, dispatch] = useStateProvider();

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

  return (
    <div className="grid grid-cols-3 h-screen w-screen max-h-screen max-w-full overflow-hidden">
      <ChatList />
      {/* <Empty /> */}
      <Chat />
    </div>
  );
};

export default Main;
