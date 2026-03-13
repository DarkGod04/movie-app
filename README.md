<div align="center">

  <h1>🎬 QuickShow</h1>
  
  <p>
    <strong>A Next-Gen Movie Discovery Platform with meaningful aesthetics.</strong>
  </p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#built-with">Built With</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  
</div>

<br />

## 💎 Project Overview

**QuickShow** is not just another movie app; it's an exploration into **"God-Level" UI/UX Design**. Built to mimic the premium feel of top-tier streaming services, it combines robust data fetching with immersive glassmorphism, animated backgrounds, and fluid micro-interactions.

The goal was simple: **Make data beautiful.**

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🎨 Ultra-Premium UI** | Features a cohesive **Dark Glassmorphism** theme, breathing ambient backgrounds, and neon-accented micro-interactions. |
| **📱 Motion Trailers Hub** | A **TikTok-style vertical video feed** for discovering movies. Includes auto-play, dynamic audio visualizers, and a "Getting Tickets" shimmer effect. |
| **🎫 Interactive Seat Booking** | A visually stunning 3D-perspective seat layout with **dynamic pricing** (prices randomize/adjust based on demand logic) and real-time booking status using Supabase. |
| **🛡️ Admin Dashboard** | A secure, glassmorphic admin panel to manage movies and showtimes, featuring OMDb auto-fill and real-time database updates. |
| **🧠 Smart Data Layer** | Seamlessly aggregates data from **Supabase** (Bookings, Movies), **OMDb** (Ratings, Plots), and **Wikipedia** (Cast Photos) for a rich, cost-effective profile. |
| **🎭 Dynamic Cast Photos** | Uses a custom **scraper-less integration** to fetch real actor photos from Wikipedia on-the-fly, falling back to stylish generated avatars. |
| **🔄 Temporal Content** | The "Now Showing" section **rotates genres every hour** (e.g., Marvel at 2 PM, Sci-Fi at 3 PM) to keep the experience fresh. |
| **🔎 Cinematic Search** | A full-screen, animated overlay search experience that queries the database in real-time. |

## 🛠️ Built With

*   **Core**: [React.js](https://reactjs.org/) (Vite)
*   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Config for Animations & Gradients)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Complex transitions & micro-interactions)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data Sources**:
    *   **OMDb API**: Movie metadata and ratings.
    *   **Wikipedia API**: Cast image resolution.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v14 or higher)
*   npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/DarkGod04/movie-app.git
    ```
2.  **Install NPM packages**
    ```sh
    cd movie-app
    npm install
    ```
3.  **Setup Environment Variables**
    Create a `.env` file and add your Supabase and OMDb keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    ```
4.  **Run the dev server**
    ```sh
    npm run dev
    ```

## 🧩 Architecture Highlights

*   **`MotionTrailers.jsx`**: Implements a vertical snap-scroll feed with highly optimized video loading, scroll observers for auto-play, and framer-motion entrance animations.
*   **`SeatLayout.jsx`**: Handles complex booking logic, including identifying VIP vs. Standard rows, calculating dynamic prices on the client-side to ensure realism, and syncing selected states with the DB.
*   **`CastAvatar.jsx`**: A smart component that handles the complex logic of fetching actor images from Wikipedia asynchronously, ensuring the UI never breaks even if an image is missing.
*   **`ShowtimeManager.jsx`**: An admin component allowing granular control over theater schedules, integrating directly with Supabase via custom RLS policies.

## 👨‍💻 Author

**Nikhil Kumar Singh**

---
*Built with ❤️ for the love of cinema.*
