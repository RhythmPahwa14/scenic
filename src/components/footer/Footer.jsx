import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import tmdbApi, { category } from '../../api/tmdbApi';

const Footer = () => {
    const [movieGenres, setMovieGenres] = useState([]);

    useEffect(() => {
        const getGenres = async () => {
            try {
                const response = await tmdbApi.getGenreList(category.movie);
                // Get first 6 popular genres for footer
                setMovieGenres(response.genres.slice(0, 6));
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
                    <p className="footer__tagline">Your gateway to endless entertainment universe</p>
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
                        <h4>Discover</h4>
                        <ul>
                            <li><Link to="/movie/type/top_rated">You must watch</Link></li>
                            <li><Link to="/movie/type/now_playing">Recent release</Link></li>
                            <li><Link to="/movie/type/top_rated">Top IMDB</Link></li>
                        </ul>
                    </div>

                    <div className="footer__section">
                        <h4>Genres</h4>
                        <ul>
                            {movieGenres.map((genre) => (
                                <li key={genre.id}>
                                    <Link to={`/movie?genre=${genre.id}`}>{genre.name}</Link>
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
                        <p>© 2024 Scenic. Crafted with ❤️ by <a href="https://github.com/vanshaj-pahwa" target="_blank" rel="noopener noreferrer">Vanshaj Pahwa</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;