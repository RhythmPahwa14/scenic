import React, { useState, useEffect, useCallback } from "react";
import "./SeriesVideoPlayer.scss";
import apiConfig from "../../../api/apiConfig";
import tmdbApi from "../../../api/tmdbApi";
import Loading from "../../../components/loading/Loading";
import VideoPlayerModal from "../../../components/video-player-modal/VideoPlayerModal";

const SeriesVideoPlayer = ({ id, series }) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [serverUrl, setServerUrl] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Auto-select the first non-zero season or restore from localStorage
  useEffect(() => {
    if (series?.seasons?.length > 0 && id) {
      const storageKey = `series_${id}_state`;
      const savedState = localStorage.getItem(storageKey);
      
      if (savedState) {
        try {
          const { season, episode, seriesId } = JSON.parse(savedState);
          
          // Verify that the saved state is for the current series
          if (seriesId === id) {
            setSelectedSeason(season);
            setSelectedEpisode(episode);
          } else {
            // Saved state is for a different series, reset to first season
            const first = series.seasons.find((s) => s.season_number !== 0);
            if (first) setSelectedSeason(first.season_number);
          }
        } catch (error) {
          console.error("Error parsing saved state:", error);
          // Fallback to first season if parsing fails
          const first = series.seasons.find((s) => s.season_number !== 0);
          if (first) setSelectedSeason(first.season_number);
        }
      } else {
        // No saved state, select first season
        const first = series.seasons.find((s) => s.season_number !== 0);
        if (first) setSelectedSeason(first.season_number);
      }
    }
  }, [series, id]);

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
    } else if (index === 4) {
      url = `${process.env.REACT_APP_TV_SERVER5}${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`;
    } else if (index === 5) {
      url = `${process.env.REACT_APP_TV_SERVER6}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 6) {
      url = `${process.env.REACT_APP_TV_SERVER7}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 7) {
      url = `${process.env.REACT_APP_TV_SERVER8}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 8) {
      url = `${process.env.REACT_APP_TV_SERVER9}${id}/${selectedSeason}/${selectedEpisode}`;
    } else if (index === 9) {
      url = `${process.env.REACT_APP_TV_SERVER10}${id}/${selectedSeason}/${selectedEpisode}`;
    }

    setServerUrl(url);
  };

  useEffect(() => {
    if (selectedServer !== null && selectedEpisode !== null) {
      handleServerClick(selectedServer);
    }
    // eslint-disable-next-line
  }, [selectedEpisode, selectedServer]);


  const fetchEpisodes = useCallback((seasonNum) => {
    setLoadingEpisodes(true);
    tmdbApi.getSeason(id, seasonNum).then((response) => {
      setEpisodes(response.episodes);
      setLoadingEpisodes(false);
    });
  }, [id]);

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
    // Immediately set the server URL when episode is clicked
    const url = `${process.env.REACT_APP_TV_SERVER1}${id}/${selectedSeason}/${episode_number}`;
    setServerUrl(url);
    setSelectedServer(0);
    setIsModalOpen(true);
  };

  const handlePreviousEpisode = () => {
    if (selectedEpisode > 1) {
      setSelectedEpisode(selectedEpisode - 1);
    } else if (selectedSeason > 1) {
      const prevSeason = selectedSeason - 1;
      setSelectedSeason(prevSeason);
      // Fetch episodes for previous season and select last episode
      tmdbApi.getSeason(id, prevSeason).then((response) => {
        setEpisodes(response.episodes);
        setSelectedEpisode(response.episodes.length);
      });
    }
  };

  const handleNextEpisode = () => {
    if (episodes.length > 0 && selectedEpisode < episodes.length) {
      setSelectedEpisode(selectedEpisode + 1);
    } else if (series?.seasons && selectedSeason < series.seasons.filter(s => s.season_number !== 0).length) {
      const nextSeason = selectedSeason + 1;
      setSelectedSeason(nextSeason);
      setSelectedEpisode(1);
    }
  };

  const hasPreviousEpisode = () => {
    return selectedEpisode > 1 || selectedSeason > 1;
  };

  const hasNextEpisode = () => {
    // Check if there's a next episode in current season
    if (episodes.length > 0 && selectedEpisode < episodes.length) {
      return true;
    }
    // Check if there's a next season
    const totalSeasons = series?.seasons ? series.seasons.filter(s => s.season_number !== 0).length : 0;
    if (selectedSeason < totalSeasons) {
      return true;
    }
    return false;
  };

  const getCurrentEpisodeTitle = () => {
    return series.name || '';
  };

  const getCurrentEpisodeSubtitle = () => {
    const episode = episodes.find(ep => ep.episode_number === selectedEpisode);
    const episodeInfo = episode ? episode.name : '';
    return `S${selectedSeason} • E${selectedEpisode}${episodeInfo ? ` • ${episodeInfo}` : ''}`;
  };

  useEffect(() => {
    if (selectedSeason) fetchEpisodes(selectedSeason);
  }, [selectedSeason, fetchEpisodes]);

  // Save selected series, season and episode to localStorage
  useEffect(() => {
    if (selectedSeason !== null && id) {
      const storageKey = `series_${id}_state`;
      const state = {
        seriesId: id,
        season: selectedSeason,
        episode: selectedEpisode
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [selectedSeason, selectedEpisode, id]);

  return (
    <React.Fragment>
      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serverUrl={serverUrl}
        title={getCurrentEpisodeTitle()}
        subtitle={getCurrentEpisodeSubtitle()}
        onServerChange={handleServerClick}
        selectedServer={selectedServer}
        onPrevious={handlePreviousEpisode}
        onNext={handleNextEpisode}
        hasPrevious={hasPreviousEpisode()}
        hasNext={hasNextEpisode()}
      />

      <div>

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
                      className={`episode-card ${selectedEpisode === episode.episode_number ? "selected" : ""}`}
                    >
                      <div className="episode-image-container">
                        {episode.still_path ? (
                          <>
                            <img
                              src={apiConfig.w500Image(episode.still_path)}
                              alt={episode.name}
                              className="episode-image"
                            />
                            <div className="episode-overlay">
                              <div className="play-button">
                                <i className="bx bx-play"></i>
                              </div>
                            </div>
                          </>
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
                        <div>
                          <h4 className="episode-title">
                            Episode {episode.episode_number}: {episode.name}
                          </h4>
                          <p className="episode-overview">
                            {episode.overview || "No description available."}
                          </p>
                        </div>

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