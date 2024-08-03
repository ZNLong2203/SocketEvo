import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { useStateProvider } from "@/context/StateContext";
import { SEND_MESSAGE_ROUTE, ADD_IMAGE_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";

const MessageBar = () => {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleOutSideClick = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleOutSideClick);
  }, []);

  useEffect(() => {
    if(grabPhoto) {
        const data = document.getElementById("photo-picker")
        data.click()
        document.body.onfocus = (e) => {
            setTimeout(() => {
                setGrabPhoto(false)
            }, 1000)
        }
    }
  }, [grabPhoto])

  const handleEmojiModal = () => {
    setShowEmoji(!showEmoji);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(SEND_MESSAGE_ROUTE, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message,
      });
      socket.current.emit("send-message", {
        message: response.data.messages,
        from: userInfo?.id,
        to: currentChatUser?.id,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGES,
        newMessages: response.data.messages,
        fromSelf: true,
      });
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });
      if(response.status===201) {
        socket.current.emit("send-message", {
          message: response.data.messages,
          from: userInfo?.id,
          to: currentChatUser?.id,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGES,
          newMessages: response.data.messages,
          fromSelf: true,
        });
        setGrabPhoto(false);
      }
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative z-10">
      <div className="flex gap-6">
        <BsEmojiSmile
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Emoji"
          id="emoji-open"
          onClick={handleEmojiModal}
        />
        {showEmoji && (
          <div className="absolute bottom-24 left-16 z-40" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}
        <ImAttachment
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Attach File"
          onClick={() => setGrabPhoto(true)}
        />
      </div>
      <div className="w-full rounded-lg h-10 flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <div className="flex w-10 items-center justify-center">
        <button className="flex flex-row gap-4" onClick={sendMessage}>
          <MdSend
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Send Message"
          />
          <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" />
        </button>
      </div>
      {grabPhoto && (<PhotoPicker onChange={photoPickerChange} />)}
    </div>
  );
};

export default MessageBar;
