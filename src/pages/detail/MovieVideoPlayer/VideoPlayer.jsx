import { useState, useEffect, useCallback } from "react";
import "./VideoPlayer.scss";
import VideoPlayerModal from "../../../components/video-player-modal/VideoPlayerModal";

const VideoPlayer = ({ id, title, shouldOpenPlayer, onPlayerOpen }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [serverUrl, setServerUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServerClick = (index) => {
    setSelectedServer(index);
    switch (index) {
      case 0:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER1}${id}`);
        break;
      case 1:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER2}${id}`);
        break;
      case 2:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER3}${id}`);
        break;
      case 3:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER4}${id}`);
        break;
      case 4:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER5}${id}`);
        break;
      case 5:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER6}${id}`);
        break;
      case 6:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER7}${id}`);
        break;
      case 7:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER8}${id}`);
        break;
      case 8:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER9}${id}`);
        break;
      case 9:
        setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER10}${id}`);
        break;
      default:
        break;
    }
  };

  const handlePlayButtonClick = useCallback(() => {
    setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER1}${id}`);
    setSelectedServer(0);
    setIsModalOpen(true);
  }, [id]);

  useEffect(() => {
    if (shouldOpenPlayer) {
      handlePlayButtonClick();
      if (onPlayerOpen) {
        onPlayerOpen();
      }
    }
  }, [shouldOpenPlayer, handlePlayButtonClick, onPlayerOpen]);

  return (
    <VideoPlayerModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      serverUrl={serverUrl}
      title={title}
      onServerChange={handleServerClick}
      selectedServer={selectedServer}
      hasPrevious={false}
      hasNext={false}
    />
  );
};

export default VideoPlayer;
