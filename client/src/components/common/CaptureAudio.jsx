import axios from "axios";
import { useStateProvider } from "@/context/StateContext";
import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaPlay, FaStop, FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";

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
  const audioBlobRef = useRef(null);

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      responsive: true,
      barWidth: 2,
      cursorWidth: 1,
      height: 30,
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });
    return () => {
      wavesurfer.destroy();
    };
  }, []);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        audioBlobRef.current = audioBlob;
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      });

      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      mediaRecorderRef.current.addEventListener("stop", () => {
        clearInterval(timer);
      });
    });
  };

  useEffect(() => {
    if (recordedAudio && waveForm) {
      waveForm.load(recordedAudio);
      waveForm.on("ready", () => {
        setTotalDuration(waveForm.getDuration());
      });
    }
  }, [recordedAudio, waveForm]);

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      if (isPlaying) {
        waveForm.pause();
        setIsPlaying(false);
      } else {
        waveForm.play();
        setIsPlaying(true);
      }
    }
  };

  const handlePauseRecording = () => {
    waveForm.pause();
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    const audioBlob = audioBlobRef.current;
    if (!audioBlob) return;

    const formData = new FormData();
    const audioFile = new File([audioBlob], "audio.wav", {
      type: "audio/wav",
    });
    formData.append("audio", audioFile);
    formData.append("from", userInfo.id);
    formData.append("to", currentChatUser.id);

    try {
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData ,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      socket.current.emit("send-message", {
        message: response.data.messages,
        from: userInfo.id,
        to: currentChatUser.id,
      });
      dispatch({
        type: "ADD_MESSAGES",
        newMessages: response.data.messages,
        fromSelf: true,
      });
      hide();
    } catch (err) {
      console.log(err);
    }
  };

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
          <div>
            {recordedAudio && !isPlaying ? (
              <FaPlay onClick={handlePlayRecording} />
            ) : (
              <FaStop onClick={handlePauseRecording} />
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording}></div>
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone
              className="text-red-500"
              onClick={handleStartRecording}
            />
          ) : (
            <FaStop className="text-red-500" onClick={handleStopRecording} />
          )}
        </div>
        <div>
          <MdSend
            className="text-panel-header-icon cursor-pointer text-xl mr-4"
            title="Send Message"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptureAudio;
