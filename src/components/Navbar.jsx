import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { SearchIcon, XIcon, MenuIcon } from 'lucide-react'
import UserMenu from './UserMenu'
import { useAuth } from '../context/AuthContext'
import SearchOverlay from './SearchOverlay'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth()

  const navigate = useNavigate()

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 bg-black/50 backdrop-blur-md border-b border-white/5'>

        <Link to='/' className='relative group'>
          <img src={assets.logo} alt="Logo" className='w-32 md:w-40 h-auto hover:opacity-90 transition-opacity' />
        </Link>

        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-10 md:gap-8 max-md:h-screen max-md:bg-black/95 transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0 overflow-hidden'}`}
        >
          <XIcon
            className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-gray-400 hover:text-white'
            onClick={() => setIsOpen(false)}
          />

          {['Home', 'Movies', 'Theaters', 'Releases', 'Trailers', 'Favorites'].map((item) => (
            <Link
              key={item}
              onClick={() => { scrollTo(0, 0); setIsOpen(false); }}
              to={item === 'Home' ? '/' : item === 'Favorites' ? '/favorite' : `/${item.toLowerCase()}`}
              className="relative text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all font-light tracking-wide text-sm md:text-base uppercase"
            >
              {item}
              {item === 'Trailers' && (
                <span className="absolute -top-3 -right-6 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-500"></span>
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-6'>

          {
            !user ? (
              <Link
                to="/login"
                className='px-6 py-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs md:text-sm font-semibold tracking-wide uppercase rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all transform hover:-translate-y-0.5'
              >
                Sign In
              </Link>
            ) : (
              <UserMenu />
            )
          }
        </div>

        <MenuIcon
          className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white'
          onClick={() => setIsOpen(true)}
        />
      </div>
    </>
  )
}

export default Navbar
