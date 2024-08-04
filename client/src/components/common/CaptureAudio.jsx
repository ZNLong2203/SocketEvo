import { useStateProvider } from "@/context/StateContext";
import React, { useState, useRef } from "react";
import { FaTrash, FaPlay, FaStop } from "react-icons/fa";

const CaptureAudio = ({ hide }) => {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  //   const handleCapture = async () => {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     const mediaRecorder = new MediaRecorder(stream);
  //     const audioChunks = [];

  //     mediaRecorder.ondataavailable = (e) => {
  //       audioChunks.push(e.data);
  //     };

  //     mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  //       const audioUrl = URL.createObjectURL(audioBlob);
  //       onCapture(audioBlob, audioUrl);
  //     };

  //     mediaRecorder.start();
  //     setTimeout(() => {
  //       mediaRecorder.stop();
  //     }, 3000);
  //   };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="textp-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>{recordedAudio && !isPlaying ? <FaPlay /> : <FaStop />}</div>
        )}
      </div>
    </div>
  );
};

export default CaptureAudio;
