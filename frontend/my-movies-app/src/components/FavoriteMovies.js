import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import SearchNav from "./SearchNav";
import Dashboard from "./Dashboard";

export default function FavoriteMovies({ username }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favorites/${username}`);
        const { data } = response;
        if (data.success) {
          setFavorites(data.data);
        } else {
          console.error("Failed to fetch favorites:", data.msg);
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [username]);


  return (
    <div>
      <SearchNav />
      <Dashboard index={2} />
      <h1>Favorites...</h1>
      <div className="MoviesCont">
        {favorites.length > 0 ? (
          favorites.map((movie, index) => (
            <MovieCard
              key={index}
              name={movie.title}
              src={movie.img}
              category={movie.category}
              rating={movie.rating}
              description={movie.description}
            />
          ))
        ) : (
          <p>No favorites found.</p>
        )}
      </div>
    </div>
  );
}
