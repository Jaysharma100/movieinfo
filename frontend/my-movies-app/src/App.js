import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ExploreMovies from './components/ExploreMovies';
import Explore from './components/Explore';
import MovieDetails from './components/MovieDetails';
import Signup from './components/Signup';
import Login from './components/Login';
import FavoriteMovies from './components/FavoriteMovies';
import { useUser } from './context/Usercontext';

function App() {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const {username1} =useUser();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // Convert token presence to boolean
  }, []);

  return (
    <div id="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        {isLoggedin ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/Category/:category" element={<ExploreMovies />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/MovieDetails/:movieName" element={<MovieDetails />} />
            <Route path='/Favorites' element={<FavoriteMovies username={username1}/>}/>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
