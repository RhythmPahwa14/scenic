import React, { useState } from "react";
import "./VideoPlayer.scss";
import Card from "../../../components/card/Card";
import { servers } from "../../../constants/constants";
import apiConfig from "../../../api/apiConfig";
import Button from "../../../components/button/Button";

const VideoPlayer = ({ id, title, movie }) => {
  const [selectedServer, setSelectedServer] = useState(null);
  const [serverUrl, setServerUrl] = useState("");

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
      default:
        break;
    }
  };

  const handlePlayButtonClick = () => {
    setServerUrl(`${process.env.REACT_APP_MOVIE_SERVER1}${id}`);
    setSelectedServer(0);
  };

  return (
    <React.Fragment>
      <div className="video-player-container">
        {serverUrl ? (
          <iframe src={serverUrl} allowFullScreen title={title} />
        ) : (
          <div className="poster-container" onClick={handlePlayButtonClick}>
            <img
              src={`${apiConfig.originalImage(movie.poster_path)}`}
              alt={movie.title}
              className="poster-image"
            />
            <div className="gradient-overlay" />
            <Button onClick={handlePlayButtonClick}>
              <i className="bx bx-play"></i>
            </Button>
          </div>
        )}
      </div>
      <div>
        <div className="server-container">
          <div>
            If the current server doesn't work, please try other servers below.
          </div>
          <div className="server-card-container">
            {servers.map((server, index) => (
              <Card
                key={index}
                className={`server-card ${
                  selectedServer === index ? "selected" : ""
                }`}
                onClick={() => handleServerClick(index)}
              >
                {server}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoPlayer;
