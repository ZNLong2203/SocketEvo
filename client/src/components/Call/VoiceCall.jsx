import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";

const Container = dynamic(() => import("./Container"), { ssr: false });

const VoiceCall = () => {
  const [{ voiceCall, socket, userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    if(voiceCall.type === "out-going") {
      socket.current.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: userInfo.id,
          image: userInfo.image,
          name: userInfo.displayName,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      })
    }
  }, [voiceCall])

  return(
    <Container data={voiceCall}/>
  )
}

export default VoiceCall;
