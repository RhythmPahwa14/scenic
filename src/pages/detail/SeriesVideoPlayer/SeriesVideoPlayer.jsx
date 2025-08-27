import React, { useState, useEffect } from "react";
import "./SeriesVideoPlayer.scss";
import Card from "../../../components/card/Card";
import { servers } from "../../../constants/constants";
import apiConfig from "../../../api/apiConfig";
import Button from "../../../components/button/Button";
import tmdbApi from "../../../api/tmdbApi";
import Select from "react-select";

const SeriesVideoPlayer = ({ id, title, series }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [serverUrl, setServerUrl] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  const handleServerClick = (index) => {
    setSelectedServer(index);
    let url = "";
    if (index === 0) {
      url = `${process.env.REACT_APP_TV_SERVER1}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 1) {
      url = `${process.env.REACT_APP_TV_SERVER2}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 2) {
      url = `${process.env.REACT_APP_TV_SERVER3}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 3) {
      url = `${process.env.REACT_APP_TV_SERVER4}?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}`;
    } else {
      url = `${process.env.REACT_APP_TV_SERVER5}${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`;
    }
    setServerUrl(url);
  };

  useEffect(() => {
    if (selectedServer !== null && selectedEpisode !== null) {
      handleServerClick(selectedServer);
    }
    // eslint-disable-next-line
  }, [selectedEpisode, selectedServer]);

  const handlePlayButtonClick = () => {
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setServerUrl(
      `${process.env.REACT_APP_TV_SERVER1}/${id}/1/1`
    );
    setSelectedServer(0);
  };

  const handleSeasonChange = (option) => {
    const season = Number(option.value);
    setSelectedSeason(season);
    setSelectedEpisode(null);
    setEpisodes([]);
  };

  const handleEpisodeClick = (episode_number) => {
    setSelectedEpisode(episode_number);
  };

  useEffect(() => {
    if (selectedSeason > 0) {
      tmdbApi.getSeason(id, selectedSeason).then((response) => {
        setEpisodes(response.episodes);
      });
    }
  }, [selectedSeason, id]);

  const seasonOptions = series.seasons
    ? series.seasons
        .filter(season => season.season_number !== 0)
        .map(season => ({
          value: season.season_number,
          label: `Season ${season.season_number}`
        }))
    : [];

    const customSelectStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: state.isFocused ? "2px solid #00d4ff" : "2px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "12px",
        color: "white",
        minWidth: '12rem',
        maxWidth: '12rem',
        boxShadow: state.isFocused ? "0 6px 16px rgba(0, 0, 0, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          borderColor: "#00d4ff"
        }
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "#f8fafc",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "rgba(26, 26, 46, 0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        maxWidth: '12rem',
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        zIndex: 9999
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected 
          ? "linear-gradient(135deg, #00d4ff, #4ecdc4)" 
          : state.isFocused 
            ? "rgba(0, 212, 255, 0.1)" 
            : "transparent",
        color: "#f8fafc",
        cursor: 'pointer',
        "&:hover": {
          backgroundColor: "rgba(0, 212, 255, 0.1)",
        },
        maxWidth: '12rem'
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#64748b",
      }),
      input: (provided) => ({
        ...provided,
        color: "#f8fafc",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#64748b",
        "&:hover": {
          color: "#00d4ff"
        }
      }),
    };

  return (
    <React.Fragment>
      <div className="series-player-container">
        {serverUrl && selectedEpisode ? (
          <iframe src={serverUrl} allowFullScreen title={title} />
        ) : (
          <div
            className="series-poster-container"
            onClick={handlePlayButtonClick}
          >
            <img
              src={`${apiConfig.originalImage(series.poster_path)}`}
              alt={title}
              className="series-poster-image"
            />
            <div className="series-gradient-overlay" />
            <Button onClick={handlePlayButtonClick}>
              <i className="bx bx-play"></i>
            </Button>
          </div>
        )}
      </div>
      <div>
        {selectedEpisode && (
          <div className="series-server-container">
            <div>
              If the current server doesn't work, please try other servers
              below.
            </div>
            <div className="series-server-card-container">
              {servers.map((server, index) => (
                <Card
                  key={index}
                  className={`series-server-card ${
                    selectedServer === index ? "selected" : ""
                  }`}
                  onClick={() => handleServerClick(index)}
                >
                  {server}
                </Card>
              ))}
            </div>
          </div>
        )}
        {series.seasons && series.seasons.length > 0 && (
          <div className="season-container">
            <Select
            options={seasonOptions}
            onChange={handleSeasonChange}
              value={seasonOptions.find(
                (option) => option.value === selectedSeason
              )}
            placeholder="Select a season"
            isSearchable={false}
            styles={customSelectStyles}
          />
            {episodes.length > 0 && (
              <div className="episode-container">
                <h3>Episodes</h3>
                <div className="episode-list">
                  {episodes.map((episode) => (
                    <Card
                      key={episode.id}
                      onClick={() => handleEpisodeClick(episode.episode_number)}
                      className={`series-episode-card ${
                        selectedEpisode === episode.episode_number
                          ? "selected"
                          : ""
                      }`}
                    >
                      Episode {episode.episode_number}: {episode.name}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default SeriesVideoPlayer;