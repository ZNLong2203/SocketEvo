import React from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";

const Container = dynamic(() => import("./Container"), { ssr: false });

const VideoCall = () => {
  const [{ videoCall, socket, userInfo }, dispatch] = useStateProvider();
  return(
    <Container data={videoCall}/>
  )
}

export default VideoCall;
