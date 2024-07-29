import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";

const Avatar = ({ type, image, setImage }) => {
  const [hover, setHover] = useState(false);
const [grabPhoto, setGrabPhoto] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if(grabPhoto) {
        const data = document.getElementById("photo-picker")
        data.click()
        document.body.onfocus = (e) => {
            setGrabPhoto(false)
        }
    }
  }, [grabPhoto])

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuCordinates({ x: e.clientX, y: e.clientY });
  };

  const contextMenuOptions = [
    { name: "Take Photo", callback: () => {} },
    { name: "Choose from Gallery", callback: () => {} },
    { name: "Upload Photo", callback: () => {
        setGrabPhoto(true);
    } },
    { name: "Remove Photo", callback: () => setImage("/default_avatar.png") },
  ]

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function(event) {
        data.src = event.target.result;
        data.setAttribute("data-src", event.target.result); 
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
        setImage(data.src);
    }, 100);
  };

  return (
    <div className="flex items-center justify-center">
      {type === "sm" && (
        <div className="relative h-10 w-10">
          <Image src={image} alt="avatar" className="rounded-full" fill />
        </div>
      )}
      {type === "lg" && (
        <div className="relative h-14 w-14">
          <Image src={image} alt="avatar" className="rounded-full" fill />
        </div>
      )}
      {type === "xl" && (
        <div
          className="relative cursor-pointer z-0"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div
            className={`bg-photopicker-overlay-background z-10 h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2" ${
              hover ? "visible" : "hidden"
            } `}
            onClick={(e) => showContextMenu(e)}
          >
            <FaCamera
              className="text-2xl"
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            />
            <span onClick={(e) => showContextMenu(e)}>
              {" "}
              Change Profile Photo
            </span>
          </div>
          <div className="flex items-center justify-center h-60 w-60">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        </div>
      )}
        {isContextMenuVisible && (<ContextMenu 
        options={contextMenuOptions}
        cordinates={contextMenuCordinates}
        contextMenu={isContextMenuVisible}
        setContextMenu={setIsContextMenuVisible}
        />)}
        {grabPhoto && (<PhotoPicker onChange={photoPickerChange} />)}
    </div>
  );
};

export default Avatar;
