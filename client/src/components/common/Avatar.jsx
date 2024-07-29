import React, { useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";

const Avatar = ({ type, image, setImage }) => {
  const [hover, setHover] = useState(false);

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
          >
            <FaCamera className="text-2xl" if="context-opener" />
            <span>Change Profile Photo</span>
          </div>
          <div className="flex items-center justify-center h-60 w-60">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
