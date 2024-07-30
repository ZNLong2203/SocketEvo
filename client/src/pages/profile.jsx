import axios from "axios";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import Image from "next/image";
import { useStateProvider } from "../context/StateContext";
import Input from "../components/common/Input";
import Avatar from "../components/common/Avatar";
import { PROFILE_ROUTE } from "@/utils/ApiRoutes";

const profile = () => {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.displayName || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if(newUser) {
        Router.push('/login')
    } else if(!newUser) {
        Router.push('/')
    }
  }, [newUser, userInfo]);

  const validate = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };

  const profileUserHandler = async () => {
    if (validate()) {
      const email = userInfo.email;
      try {
        const response = await axios.post(PROFILE_ROUTE, {
          email,
          name,
          about,
          image,
        });
        if(response) {
            dispatch({
                type: reducerCases.SET_NEW_USER,
                newUser: false,
            }),
            dispatch({
                type: reducerCases.SET_USER_INFO,
                userInfo: {
                    displayName,
                    email,
                    photoUrl: image,
                    status: about,
                },
            })
            Router.push('/')
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/ZkareLogo.png" alt="Whatsapp" width={300} height={300} />
        <span className="text-7xl">SocketEvo</span>
      </div>
      <h2 className="text-2xl mt-10">Create your profile</h2>
      <div className="flex-gap-6 flex flex-row gap-16">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input
            name="DisplayName"
            state={name}
            setState={setName}
            label="Display Name"
          />
          <Input name="About" state={about} setState={setAbout} label="About" />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-4 rounded-lg"
              onClick={profileUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
};

export default profile;
