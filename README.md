
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
  
</div>

<br />

## 💎 Project Overview

**QuickShow** is not just another movie app; it's an exploration into **"God-Level" UI/UX Design**. Built to mimic the premium feel of top-tier streaming services, it combines robust data fetching with immersive glassmorphism, animated backgrounds, and fluid micro-interactions.

The goal was simple: **Make data beautiful.**

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🎨 Ultra-Premium UI** | Features a cohesive **Dark Glassmorphism** theme, breathing ambient backgrounds, and neon-accented micro-interactions. |
| **🧠 Smart Data Layer** | Seamlessly aggregates data from **OMDb** (Ratings, Plots) and **Wikipedia** (Cast Photos) to create a rich info profile without paid APIs. |
| **🎭 Dynamic Cast Photos** | Uses a custom **scraper-less integration** to fetch real actor photos from Wikipedia on-the-fly, falling back to stylish generated avatars. |
| **🔄 Temporal Content** | The "Now Showing" section **rotates genres every hour** (e.g., Marvel at 2 PM, Sci-Fi at 3 PM) to keep the experience fresh. |
| **📱 Fully Responsive** | carefully crafted grid systems ensure a cinematic experience on everything from 4K Monitors to Mobile Screens. |

## 🛠️ Built With

*   **Core**: [React.js](https://reactjs.org/) (Vite)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Config for Animations & Gradients)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data Sources**:
    *   **OMDb API**: Movie metadata and ratings.
    *   **Wikipedia API**: Cast image resolution.
    *   **TVMaze API**: Fallback search layer.

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
3.  **Run the dev server**
    ```sh
    npm run dev
    ```

## 🧩 Architecture Highlights

*   **`CastAvatar.jsx`**: A smart component that handles the complex logic of fetching actor images from Wikipedia asynchronously, ensuring the UI never breaks even if an image is missing.
*   **`FeaturedSection.jsx`**: Implements the time-based content rotation logic, effectively "curating" the app automatically throughout the day.
*   **`MovieDetail.jsx`**: A complex view combining parallax effects, gradient overlays, and multi-source data merging (OMDb + Internal Props).

## 👨‍💻 Author

**Nikhil Kumar Singh**

---
*Built with ❤️ for the love of cinema.*
