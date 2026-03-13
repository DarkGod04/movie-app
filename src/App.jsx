import React from 'react'
import Navbar from './components/Navbar' // Fix missing import
import { Route, Routes, useLocation } from 'react-router-dom'
import SEO from './components/SEO'

const Home = React.lazy(() => import('./pages/home'));
const Movies = React.lazy(() => import('./pages/Movies'));
const MovieDetail = React.lazy(() => import('./pages/MovieDetail'));
const SeatLayout = React.lazy(() => import('./pages/seatlayout'));
const MyBookings = React.lazy(() => import('./pages/mybookings'));
const Favorite = React.lazy(() => import('./pages/Favorite'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Footer = React.lazy(() => import('./components/Footer'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));
const TheaterList = React.lazy(() => import('./pages/TheaterList'));
const Releases = React.lazy(() => import('./pages/Releases'));
const MotionTrailers = React.lazy(() => import('./pages/MotionTrailers'));
const AdminRoute = React.lazy(() => import('./components/AdminRoute'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Careers = React.lazy(() => import('./pages/Careers'));

import { Toaster } from 'react-hot-toast'
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  return (
    <>
      <Toaster />
      <SEO />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <ErrorBoundary>
        <React.Suspense fallback={<Loading />}>
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
            <Route path='/about' element={<AboutUs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/help' element={<HelpCenter />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path='/careers' element={<Careers />} />

            {/* Admin Routes */}
            <Route path='/admin' element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  )
}

export default App
