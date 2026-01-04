import React from 'react'
import Navbar from './components/navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Movies from './pages/movies'
import MovieDetail from './pages/moviedetail'
import SeatLayout from './pages/seatlayout'
import MyBookings from './pages/mybookings'
import Favorite from './pages/favorite'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import Footer from './components/footer'
import ProtectedRoute from './components/ProtectedRoute'
import TheaterList from './pages/TheaterList'
import Releases from './pages/Releases'
import MotionTrailers from './pages/MotionTrailers'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  return (
    <>
      <Toaster />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetail />} />
        <Route path='/movies/:id/:date' element={
          <ProtectedRoute>
            <SeatLayout />
          </ProtectedRoute>
        } />
        <Route path='/mybookings' element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path='/favorite' element={
          <ProtectedRoute>
            <Favorite />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/theaters' element={<TheaterList />} />
        <Route path='/releases' element={<Releases />} />
        <Route path='/trailers' element={<MotionTrailers />} />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  )
}

export default App
