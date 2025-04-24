import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import GenreMovies from './pages/GenreMovies'
import SearchResults from './pages/SearchResults'
import PopularMovies from './pages/PopularMovies'
import NewestMovies from './pages/NewestMovies'
import AllGenres from './pages/AllGenres'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/genre/:id" element={<GenreMovies />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/popular" element={<PopularMovies />} />
            <Route path="/newest" element={<NewestMovies />} />
            <Route path="/genres" element={<AllGenres />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
