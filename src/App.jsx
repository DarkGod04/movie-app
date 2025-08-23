import React from 'react'
import Navbar from './components/navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Movies from './pages/movies'
import MovieDetail from './pages/moviedetail'
import SeatLayout from './pages/seatlayout'
import MyBookings from './pages/mybookings'
import Favorite from './pages/favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/footer'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetail />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/mybookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
