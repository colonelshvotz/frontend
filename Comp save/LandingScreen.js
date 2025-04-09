// frontend/Components/LandingScreen.js

import React from "react";
import { useRouter } from "next/router";

export default function LandingScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/bookshelf"); // or change to '/' if your bookshelf is the homepage
  };

  return (
    <div
      style={{
        backgroundImage: "url('/StartScreen.png')", // Make sure this path works
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <button
        onClick={handleStart}
        style={{
          padding: "16px 32px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: "2px solid white",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Start Game
      </button>
    </div>
  );
}
