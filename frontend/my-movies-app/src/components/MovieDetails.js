import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/Usercontext.js';
import './MovieDetails.css';
import Dashboard from './Dashboard.js';

export default function MovieDetails() {
  const { movieName } = useParams();
  const { username1 } = useUser();
  const decodedMovieName = decodeURIComponent(movieName);
  const movie = decodedMovieName.split(' ').slice(0, -1).join(' ');
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const { data } = await axios.get(`http://www.omdbapi.com/?t=${movie}&apikey=71dc8d82`);
        if (data.Response === 'True') {
          setMovieDetails(data);
        } else {
          console.error('Error fetching movie details:', data.Error);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [decodedMovieName, movie]);

  const addToFavorites = async () => {
    try {
      const { Title, Poster, Plot, Genre, imdbRating } = movieDetails;
      const details = {
        movieTitle: Title,
        movieDetails: { title: decodedMovieName, img: Poster, description: Plot, category: Genre?.split(',')[0], rating: imdbRating }
      };

      const response = await axios.post('http://localhost:5000/api/favorites/add', {
        username: username1,
        details: details,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };


  return (
    <>
      <Dashboard index={0}/>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="movie-details-container">
          <h2>{movieDetails.Title}</h2>
          <img src={movieDetails.Poster} alt={movieDetails.Title} />
          {movieDetails.Released && <p><strong>Released:</strong> {movieDetails.Released}</p>}
          {movieDetails.Genre && <p><strong>Genre:</strong> {movieDetails.Genre}</p>}
          {movieDetails.Plot && <p><strong>Plot:</strong> {movieDetails.Plot}</p>}
          {movieDetails.imdbRating && <p><strong>IMDB Rating:</strong> {movieDetails.imdbRating}</p>}
          {movieDetails.Director && <p><strong>Director:</strong> {movieDetails.Director}</p>}
          {movieDetails.Writer && <p><strong>Writer:</strong> {movieDetails.Writer}</p>}
          {movieDetails.Actors && <p><strong>Actors:</strong> {movieDetails.Actors}</p>}
          {movieDetails.Language && <p><strong>Language:</strong> {movieDetails.Language}</p>}
          {movieDetails.Country && <p><strong>Country:</strong> {movieDetails.Country}</p>}
          {movieDetails.Awards && <p><strong>Awards:</strong> {movieDetails.Awards}</p>}
          {movieDetails.Metascore && <p><strong>Metascore:</strong> {movieDetails.Metascore}</p>}
          {movieDetails.BoxOffice && <p><strong>Box Office:</strong> {movieDetails.BoxOffice}</p>}
          {movieDetails.Production && <p><strong>Production:</strong> {movieDetails.Production}</p>}
          {movieDetails.Website && (
            <p>
              <strong>Website:</strong>{' '}
              <a href={movieDetails.Website} target="_blank" rel="noopener noreferrer">
                {movieDetails.Website}
              </a>
            </p>
          )}
          {movieDetails.Rated && <p><strong>Rated:</strong> {movieDetails.Rated}</p>}
          {movieDetails.Runtime && <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>}
          {movieDetails.DVD && <p><strong>DVD Release:</strong> {movieDetails.DVD}</p>}
          {movieDetails.Type && <p><strong>Type:</strong> {movieDetails.Type}</p>}

          {/* Buttons for adding to favorites and watch later */}
          <button onClick={addToFavorites}>Add to Favorites</button>
        </div>
      )}
    </>
  );
}
