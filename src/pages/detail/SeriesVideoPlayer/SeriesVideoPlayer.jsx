import React, { useState, useEffect } from "react";
import "./SeriesVideoPlayer.scss";
import Card from "../../../components/card/Card";
import { servers } from "../../../constants/constants";
import apiConfig from "../../../api/apiConfig";
import Button from "../../../components/button/Button";
import tmdbApi from "../../../api/tmdbApi";
import Loading from "../../../components/loading/Loading";

const SeriesVideoPlayer = ({ id, title, series, onEpisodeClick }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [serverUrl, setServerUrl] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const dropdownRef = React.useRef(null);
  const menuRef = React.useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // if click is NOT inside dropdown button AND NOT inside menu → close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-select the first non-zero season
  useEffect(() => {
    if (series?.seasons?.length > 0) {
      const first = series.seasons.find((s) => s.season_number !== 0);
      if (first) setSelectedSeason(first.season_number);
    }
  }, [series]);

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
    setServerUrl(`${process.env.REACT_APP_TV_SERVER1}/${id}/1/1`);
    setSelectedServer(0);
  };

  const fetchEpisodes = (seasonNum) => {
  setLoadingEpisodes(true);
  tmdbApi.getSeason(id, seasonNum).then((response) => {
    setEpisodes(response.episodes);
    setLoadingEpisodes(false);
  });
};

  const handleSeasonChange = (option) => {
    const season = Number(option.value);
    setSelectedSeason(season);
    setSelectedEpisode(null);
    setEpisodes([]);
    setLoadingEpisodes(true);

    fetchEpisodes(season);
  };

  const handleEpisodeClick = (episode_number) => {
    setSelectedEpisode(episode_number);
    // Scroll to player section when episode is clicked
    if (onEpisodeClick) {
      onEpisodeClick();
    }
  };

  useEffect(() => {
  if (selectedSeason) fetchEpisodes(selectedSeason);
}, [selectedSeason]);

  return (
    <React.Fragment>
      <div className="series-player-container">
        {serverUrl && selectedEpisode ? (
          <iframe src={serverUrl} allowFullScreen title={title} />
        ) : (
          <div className="series-poster-container" onClick={handlePlayButtonClick}>
            <img
              src={apiConfig.originalImage(series.poster_path)}
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
        {/* SERVER OPTIONS */}
        {selectedEpisode && (
          <div className="series-server-container">
            <div>If the current server doesn't work, try another below.</div>
            <div className="series-server-card-container">
              {servers.map((server, index) => (
                <Card
                  key={index}
                  className={`series-server-card ${selectedServer === index ? "selected" : ""}`}
                  onClick={() => handleServerClick(index)}
                >
                  {server}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SEASON DROPDOWN */}
        {series?.seasons?.length > 0 && (
          <div className="season-container">
            <div className="season-dropdown">
              <div
                ref={dropdownRef}
                className="season-dropdown-selected compact"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="label">Season {selectedSeason}</span>

                {dropdownOpen ? (
                  // Chevron Up
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chevron-icon"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                ) : (
                  // Chevron Down
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="chevron-icon"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="season-dropdown-menu" ref={menuRef}>
                  {series.seasons
                    .filter((s) => s.season_number !== 0)
                    .map((season) => (
                      <div
                        key={season.id}
                        className="season-option"
                        onClick={() => {
                          handleSeasonChange({ value: season.season_number });
                          setDropdownOpen(false);
                        }}
                      >
                        <img
                          src={apiConfig.w500Image(season.poster_path)}
                          alt={season.name}
                        />

                        <div className="info">
                          <h4>Season {season.season_number}</h4>
                          <p>{season.episode_count} episodes</p>
                        </div>

                        <span className="year">
                          {season.air_date?.split("-")[0] || ""}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* EPISODE LOADER */}
            {loadingEpisodes && <Loading size="small" loadingText="Loading episodes..." />}
            {/* EPISODE LIST */}
            {!loadingEpisodes && episodes.length > 0 && (
              <div className="episode-container">
                <h3>Episodes</h3>
                <div className="episode-list">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      onClick={() => handleEpisodeClick(episode.episode_number)}
                      className={`episode-card ${selectedEpisode === episode.episode_number ? "selected" : ""
                        }`}
                    >
                      <div className="episode-image-container">
                        {episode.still_path ? (
                          <img
                            src={apiConfig.w500Image(episode.still_path)}
                            alt={episode.name}
                            className="episode-image"
                          />
                        ) : (
                          <div className="episode-placeholder">
                            <i className="bx bx-play-circle"></i>
                          </div>
                        )}
                        <div className="episode-number">
                          {episode.episode_number}
                        </div>
                      </div>

                      <div className="episode-content">
                        <h4 className="episode-title">{episode.name}</h4>
                        <p className="episode-overview">
                          {episode.overview || "No description available."}
                        </p>

                        <div className="episode-meta">
                          {episode.air_date && (
                            <span className="episode-date">
                              {new Date(episode.air_date).toLocaleDateString()}
                            </span>
                          )}
                          {episode.runtime && (
                            <span className="episode-runtime">
                              {episode.runtime}min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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