// frontend/Components/LandingScreen.js

import React from "react";
import { useRouter } from "next/router";

export default function LandingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/bookshelf"); // or change to '/' if your bookshelf is the homepage
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
    
    <img
      src="/Candles.png"
      alt="Flickering Candles"
      className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none flicker"
    />


    
    <div
  className="fade-in bg-cover bg-center h-screen w-screen flex justify-center items-center flex-col"
  style={{
    backgroundImage: "url('/StartScreen.png')",
  }}
    >


  
<button
    onClick={handleStart}
    className="absolute left-[35%] top-[61%] w-[400px] h-[100px] bg-transparent hover:bg-white/10 transition"
    aria-label="Start Game"
  >
    {/* Optional: add invisible text for screen readers */}
  </button>
    </div>
</div>
  );
}
