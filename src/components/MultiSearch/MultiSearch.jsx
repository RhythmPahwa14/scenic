import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput, Container, Grid, Text, Transition, ActionIcon } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import MovieCard from "../movie-card/MovieCard";
import Loading from "../loading/Loading";
import tmdbApi from "../../api/tmdbApi";
import { category } from "../../api/tmdbApi";
import "./MultiSearch.scss";
import Input from "../input/Input";
import Button from "../button/Button";

const MultiSearch = () => {
  const { keyword } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState(keyword || "");
  const [debouncedSearchTerm] = useDebounce(searchInput, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSearch = useCallback((value) => {
    if (value.trim().length > 0) {
      navigate(`/search/${value}`);
      setError(null);
    }
  }, [navigate]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm === "" && searchInput === "") {
      // If user cleared the search, show all movies
      handleSearch("");
    }
  }, [debouncedSearchTerm, searchInput, handleSearch]);

  const getSearchResults = useCallback(async () => {
    if (!keyword) return;
    setIsLoading(true);
    try {
      const params = {
        query: keyword,
      };
      const response = await tmdbApi.search(category.multi, { params });
      setSearchResults(response.results);
      setError(null);
    } catch (error) {
      console.error("Error searching:", error);
      setError("Failed to search. Please try again.");
      toast.error("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    getSearchResults();
  }, [getSearchResults]);

  useEffect(() => {
    setSearchInput(keyword || "");
  }, [keyword]);

  return (
    <div className="search-page">
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="search-container"
      >
        <div className="movie-search">
          <TextInput
            type="text"
            placeholder="Search Movies, TV Shows, and More..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="lg"
            className="search-input"
            leftSection={
              isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="search-icon"
                >
                  <i className="bx bx-loader-alt bx-spin" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="search-icon"
                >
                  <i className="bx bx-search" />
                </motion.div>
              )
            }
            rightSection={
              searchInput && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    setSearchInput("");
                  }}
                  className="clear-button"
                >
                  <i className="bx bx-x" />
                </ActionIcon>
              )
            }
          />
        </div>
      </motion.div>
      <div className="container">
        <h2>Search Results for "{keyword}"</h2>
        {isLoading ? (
          <Loading size="large" />
        ) : error ? (
          <div className="error-message">
            <Text color="red" size="lg" ta="center">
              {error}
            </Text>
          </div>
        ) : (
          <div className="movie-grid">
            {searchResults
              .filter((item) => item.backdrop_path || item.poster_path)
              .map((item, i) => (
                <MovieCard category={item.media_type} item={item} key={i} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSearch;
