import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { Heart } from 'lucide-react'
import { getFavorites } from '../lib/db'
import { useAuth } from '../context/AuthContext'

const Favorite = () => {
  const [favorites, setFavorites] = useState([])
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getFavorites(user.id)
        .then(setFavorites)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user])

  return favorites.length > 0 ? (
    <div className='relative pt-32 pb-40 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-screen bg-black text-white'>

      {/* Ambient Background */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-pink-900/20 rounded-full blur-[100px] pointer-events-none" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-12 relative z-10">
        <div className="p-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
          <Heart className="w-8 h-8 text-pink-500 fill-current" />
        </div>
        <div>
          <h1 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500'>Your Collection</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide">Movies you've fallen in love with</p>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 relative z-10'>
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie._id || movie.id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden'>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black pointer-events-none" />

      <div className="z-10 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-center">
        <Heart className="w-16 h-16 text-gray-700 mx-auto mb-6" />
        <h1 className='text-3xl font-bold text-white mb-2' >
          {loading ? "Loading..." : "No Favorites Yet"}
        </h1>
        <p className="text-gray-400">Start exploring and heart the movies you love!</p>
      </div>
    </div>
  )
}

export default Favorite