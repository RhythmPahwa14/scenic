import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useDebounce } from "use-debounce";
import "./movie-grid.scss";
import MovieCard from "../movie-card/MovieCard";
import { OutlineButton } from "../button/Button";
import Input from "../input/Input";
import tmdbApi, { category, movieType, tvType } from "../../api/tmdbApi";
import Select from "react-select";

const MovieGrid = (props) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { keyword } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const genreFromUrl = searchParams.get('genre');

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await tmdbApi.getGenreList(props.category);
        const genreOptions = response.genres.map((genre) => ({
          value: genre.id,
          label: genre.name,
        }));
        setGenres(genreOptions);

        // Set selected genre from URL parameter after genres are loaded
        if (genreFromUrl) {
          const genreOption = genreOptions.find(genre => genre.value.toString() === genreFromUrl);
          if (genreOption) {
            setSelectedGenre(genreOption);
          }
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const getCountries = async () => {
      try {
        const response = await tmdbApi.getCountryList();
        setCountries(
          response.map((country) => ({
            value: country.iso_3166_1,
            label: country.english_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    getGenres();
    getCountries();
  }, [props.category, genreFromUrl]);

  // Handle genre selection and URL update
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    const currentPath = location.pathname;
    if (genre) {
      navigate(`${currentPath}?genre=${genre.value}`);
    } else {
      navigate(currentPath);
    }
  };

  const getList = async () => {
    let response = null;
    const params = {};
    
    if (keyword !== undefined) {
      // Search mode
      params.query = keyword;
      response = await tmdbApi.search(props.category, { params });
    } else if (props.type) {
      // Type mode (e.g., top_rated, now_playing) - prioritize type over genre/country
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(props.type, { params });
          break;
        default:
          response = await tmdbApi.getTvList(props.type, { params });
      }
    } else if (selectedGenre || selectedCountry) {
      // Genre/Country filtering mode
      const param = {
        page: 1,
        include_adult: false,
        include_video: false,
        language: "en-US",
        sort_by: "popularity.desc",
      };
      if (selectedGenre) param.with_genres = selectedGenre.value;
      if (selectedCountry) param.with_origin_country = selectedCountry.value;

      if (props.category === category.movie) {
        response = await tmdbApi.getMoviesByGenre(param);
      } else {
        response = await tmdbApi.getTvByGenre(param);
      }
    } else {
      // Default mode - popular content
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.popular, { params });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    }
    setItems(response.results);
    setTotalPage(response.total_pages);
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, [props.category, props.type, keyword, selectedGenre, selectedCountry]);

  const loadMore = async () => {
    let response = null;
    const params = {
      page: page + 1,
    };
    
    if (keyword !== undefined) {
      // Search mode
      params.query = keyword;
      response = await tmdbApi.search(props.category, { params });
    } else if (props.type) {
      // Type mode (e.g., top_rated, now_playing) - prioritize type over genre/country
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(props.type, { params });
          break;
        default:
          response = await tmdbApi.getTvList(props.type, { params });
      }
    } else if (selectedGenre || selectedCountry) {
      // Genre/Country filtering mode
      const param = {
        page: page + 1,
        include_adult: false,
        include_video: false,
        language: "en-US",
        sort_by: "popularity.desc",
      };
      if (selectedGenre) param.with_genres = selectedGenre.value;
      if (selectedCountry) param.with_origin_country = selectedCountry.value;

      if (props.category === category.movie) {
        response = await tmdbApi.getMoviesByGenre(param);
      } else {
        response = await tmdbApi.getTvByGenre(param);
      }
    } else {
      // Default mode - popular content
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.popular, { params });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    }
    setItems([...items, ...response.results]);
    setPage(page + 1);
  };

  // Custom styles for the Select component - matching season dropdown
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
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
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
    <>
      <div className="section mb-3">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MovieSearch category={props.category} keyword={keyword} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Select
            options={genres}
            onChange={handleGenreChange}
            value={selectedGenre}
            placeholder="Select a genre"
            isSearchable={true}
            isClearable={true}
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
          <Select
            options={countries}
            onChange={(country) => setSelectedCountry(country)}
            value={selectedCountry}
            placeholder="Select a country"
            isSearchable={true}
            isClearable={true}
            styles={customSelectStyles}
            menuPortalTarget={document.body}
          />
        </div>
      </div>
      <div className="movie-grid">
        {items.map((item, i) => (
          (item.poster_path || item.backdrop_path) && <MovieCard category={props.category} item={item} key={i} />
        ))}
      </div>
      {page < totalPage ? (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={loadMore}>
            Load more
          </OutlineButton>
        </div>
      ) : null}
    </>
  );
};

const MovieSearch = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");
  const [debouncedKeyword] = useDebounce(keyword, 500);

  const goToSearch = useCallback((searchTerm) => {
    if (searchTerm && searchTerm.trim().length > 0) {
      navigate(`/${category[props.category]}/search/${searchTerm}`);
    } else {
      // If empty search, only navigate if we're currently on a search page
      if (location.pathname.includes('/search/')) {
        navigate(`/${category[props.category]}`);
      }
      // Otherwise, stay on the current page (don't redirect from type pages)
    }
  }, [props.category, navigate, location.pathname]);

  // Auto-search with debouncing
  useEffect(() => {
    if (debouncedKeyword.trim().length > 0) {
      goToSearch(debouncedKeyword);
    } else if (debouncedKeyword === "" && keyword === "" && location.pathname.includes('/search/')) {
      // Only redirect to category page if we're currently on a search page
      goToSearch("");
    }
  }, [debouncedKeyword, keyword, goToSearch, location.pathname]);

  // Keep Enter key functionality
  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch(keyword);
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [keyword, goToSearch]);

  return (
    <div className="movie-search">
      <i className="bx bx-search search-icon"></i>
      <Input
        type="text"
        placeholder={`Search ${category[props.category] === "tv" ? "Series" : "Movies"
          }`}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
};

export default MovieGrid;