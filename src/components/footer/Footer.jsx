import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import tmdbApi, { category } from '../../api/tmdbApi';

const Footer = () => {
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);

    useEffect(() => {
        const getGenres = async () => {
            try {
                const [movieResponse, tvResponse] = await Promise.all([
                    tmdbApi.getGenreList(category.movie),
                    tmdbApi.getGenreList(category.tv)
                ]);
                // Get first 6 popular genres for footer
                setMovieGenres(movieResponse.genres.slice(0, 6));
                setTvGenres(tvResponse.genres.slice(0, 6));
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        getGenres();
    }, []);

    return (
        <footer className="footer">
            <div className="footer__content container">
                <div className="footer__brand">
                    <h3 className="footer__logo">Scenic</h3>
                    <p className="footer__tagline">Whether you're searching for the latest blockbuster or discovering a hidden gem, Scenic has you covered. Stream content from multiple servers and watch trailers instantly to make your viewing decisions effortless.</p>
                </div>

                <div className="footer__links">
                    <div className="footer__section">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/movie">Movies</Link></li>
                            <li><Link to="/tv">TV Series</Link></li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>Movies</h4>
                        <ul>
                            <li><Link to="/movie/type/top_rated">Top Rated</Link></li>
                            <li><Link to="/movie/type/now_playing">Now Playing</Link></li>
                            <li><Link to="/movie/type/popular">Popular</Link></li>
                            <li><Link to="/movie/type/upcoming">Upcoming</Link></li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>TV Series</h4>
                        <ul>
                            <li><Link to="/tv/type/top_rated">Top Rated</Link></li>
                            <li><Link to="/tv/type/popular">Popular</Link></li>
                            <li><Link to="/tv/type/on_the_air">On The Air</Link></li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>Movie Genres</h4>
                        <ul>
                            {movieGenres.map((genre) => (
                                <li key={genre.id}>
                                    <Link to={`/movie?genre=${genre.id}`}>{genre.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>TV Genres</h4>
                        <ul>
                            {tvGenres.map((genre) => (
                                <li key={genre.id}>
                                    <Link to={`/tv?genre=${genre.id}`}>{genre.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>Connect</h4>
                        <div className="footer__social-icons">
                            <a href="https://github.com/vanshaj-pahwa" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="https://linkedin.com/in/vanshaj-pahwa" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a href="https://instagram.com/vanshaj.pahwa" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="container">
                    <div className="footer__credit">
                        <p>© 2024 Scenic. Developed with ❤️ by <a href="https://github.com/vanshaj-pahwa" target="_blank" rel="noopener noreferrer">Vanshaj Pahwa</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;