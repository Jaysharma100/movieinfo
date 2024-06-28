import "./SearchNav.css";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchCard from "./SearchCard";

export default function SearchNav() {
    const nav = useRef(null);
    const search = useRef(null);
    const searchDisplayer = useRef(null);

    const [moviesSearch, setMovieSearch] = useState(null);
    const [searchType, setSearchType] = useState("movie"); // Default to search for movies
    const [loading, setLoading] = useState(false);
    let scrollUp = 0;

    useEffect(() => {
        const handleScroll = () => {
            let currentScroll = document.documentElement.scrollTop;
            if (nav.current) {
                if (currentScroll > scrollUp) {
                    if (searchDisplayer.current) {
                        searchDisplayer.current.style.display = "none";
                    }
                    scrollUp = currentScroll;
                    nav.current.style.height = "0vh";
                    nav.current.style.overflow = "hidden";
                } else {
                    scrollUp = currentScroll;
                    nav.current.style.height = "12vh";
                    nav.current.style.overflow = "";
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        const searchValue = search.current.value.trim();
        if (searchValue.length === 0) {
            setMovieSearch(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`http://www.omdbapi.com/?apikey=71dc8d82&s=${searchValue}&type=${searchType}`);
            if (data.Response === "True") {
                const movies = data.Search.slice(0, 10); // Get up to 10 results
                const JSX = movies.map((item) => (
                    <SearchCard key={item.imdbID} src={item.Poster} name={item.Title} category={item.Type === "movie" ? "Movie" : "TV Show"} />
                ));
                setMovieSearch(JSX);
            } else {
                setMovieSearch([]);
            }
        } catch (error) {
            console.error("Error fetching data from OMDB API:", error);
            setMovieSearch([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav id="searchNav" ref={nav}>
            <ul id="navContainer">
                <i className="fa-solid fa-bars" onClick={() => document.querySelector("#small_aside").style.display = "block"}></i>
                <li id="logoContainer">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h3 id="logo">MovieINFO</h3>
                    </Link>
                </li>
                <li id="searchContainer">
                    <div className="searchOptions">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            className="select-dropdown"
                        >
                            <option value="movie">Movie</option>
                            <option value="series">TV Series</option>
                        </select>
                        <i className="fa-solid fa-magnifying-glass" onClick={handleSearch}></i>
                        <input
                            ref={search}
                            type="search"
                            id="searchInput"
                            placeholder="Search Movies"
                            onBlur={(e) => {
                                if (e.target.parentElement) {
                                    e.target.parentElement.style.boxShadow = "";
                                    e.target.backgroundColor = "";
                                }
                                if (searchDisplayer.current) {
                                    searchDisplayer.current.style.display = "none";
                                }
                            }}
                            onClick={(e) => {
                                if (e.target.parentElement) {
                                    e.target.parentElement.style.boxShadow = "0 0 4px var(--detailColor)";
                                    e.target.backgroundColor = "#ff424f";
                                }
                                if (searchDisplayer.current) {
                                    searchDisplayer.current.style.display = "block";
                                }
                            }}
                            onKeyDown={async (e) => {
                                if (search.current.value.length <= 1) {
                                    setMovieSearch(null);
                                }
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                    </div>
                    <div className="searchSuggestions" ref={searchDisplayer}>
                        {loading ? <p>Searching...</p> : moviesSearch ? moviesSearch.length === 0 ? <p>No results found.</p> : moviesSearch : null}
                    </div>
                </li>
            </ul>
        </nav>
    );
}
