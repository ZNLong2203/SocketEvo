import React from "react";
import Image from "next/image";

const Empty = () => {
  return(
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center">
      <Image src="/ZkareLogo.png" alt="Whatsapp" width={300} height={300} />
    </div>
  )
}

export default Empty;
