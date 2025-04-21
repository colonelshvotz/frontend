// pages/bookshelf.js

import { useState, useEffect } from "react";
import BookSelection from "../Components/BookSelection";
import CharacterSelection from "../Components/CharacterSelection";
import ChapterList from "../Components/ChapterList";
import DeveloperTools from "../Components/DeveloperTools";
import StoryDisplay from "../Components/StoryDisplay";
import StoryControls from "../Components/StoryControls";
import MomentImageGallery from "../Components/MomentImageGallery";
import ErrorDisplay from "../Components/ErrorDisplay";
import StoryLayout from "../Components/StoryLayout";

export default function BookshelfPage() {
  const [genre, setGenre] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [characterImage, setCharacterImage] = useState(null);
  const [momentImages, setMomentImages] = useState([]);
  const [input, setInput] = useState("");
  const [story, setStory] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skipImage, setSkipImage] = useState(false);
  const [storyIdea, setStoryIdea] = useState("");
  const [letAIChoose, setLetAIChoose] = useState(false);

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [isNewBook, setIsNewBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterDescription, setNewCharacterDescription] = useState("");

  const [empathyData, setEmpathyData] = useState(null);
  const [showDevPanel, setShowDevPanel] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");


const API = process.env.NEXT_PUBLIC_API_BASE;


const fetchEmpathyScores = async () => {
  try {
    const res = await fetch(`${baseURL}/developer/trait-scores`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    setEmpathyData(data);          // reuse existing state
    setShowDevPanel(true);         // opens your developer panel
  } catch (err) {
    console.error("Failed to load trait scores:", err);
  }
};


const [narratorStyle, setNarratorStyle] = useState("neutral");


  const startStory = async () => {
    const title = isNewBook ? newBookTitle : selectedBook;
    const characterName = newCharacterName || selectedCharacter;

    if (!title || !characterName) {
      alert("Please select or create a Book and Character.");
      return;
    }

    const payload = {
      title,
      genre,
      character_name: characterName,
      character_description: newCharacterDescription,
      story_idea: storyIdea,
      let_ai_decide: letAIChoose,
      skip_image: skipImage,
      narrator_style: narratorStyle,
    };
    
    try {
      setLoading(true);
      const res = await fetch(`${baseURL}/load-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setCharacterImage(data.image_url);
      setStory([data.story]);
      setStarted(true);
    } catch (err) {
      console.error("Error loading book", err);
      setError("Failed to start story.");
    } finally {
      setLoading(false);
    }
  };

  const continueStory = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const userInput = input;
    setInput("");

    setStory((prev) => [...prev, `> ${userInput}`]);
    try {
      const response = await fetch(`${baseURL}/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput }),
      });
      const data = await response.json();
      setStory((prev) => [...prev, data.story]);
    } catch (err) {
      setError("Failed to continue story.");
    }
    setLoading(false);
  };

  const downloadStory = async () => {
    try {
      const response = await fetch(`${baseURL}/export-story`, {
        method: "POST",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "My_Story.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting story:", error);
    }
  };

  const generateMomentImage = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseURL}/generate-moment-image`, {
        method: "POST",
      });
      const data = await response.json();
      setMomentImages((prev) => [...prev, data.image_url]);
    } catch (err) {
      setError("Failed to generate moment image.");
    }
    setLoading(false);
  };

  // === RENDER ===
  if (!started) {
    return (
      <div className="min-h-screen bg-[#12110f] text-white px-4 py-10">
        <BookSelection
          books={books}
          setBooks={setBooks}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          setSelectedCharacter={setSelectedCharacter}
          setIsNewBook={setIsNewBook}
          isNewBook={isNewBook}
          newBookTitle={newBookTitle}
          setNewBookTitle={setNewBookTitle}
          genre={genre}
          setGenre={setGenre}
        />

        {(selectedBook || isNewBook) && (
          <div className="max-w-2xl mx-auto mb-4">
            <button
              onClick={() => {
                setSelectedBook("");
                setIsNewBook(false);
                setSelectedCharacter("");
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded shadow"
            >
              🔙 Return to Bookshelf
            </button>
          </div>
        )}

        <ChapterList selectedBook={selectedBook} books={books} />

        {(selectedBook || isNewBook) && (
          <CharacterSelection
            books={books}
            selectedBook={selectedBook}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            isNewBook={isNewBook}
            newCharacterName={newCharacterName}
            setNewCharacterName={setNewCharacterName}
            newCharacterDescription={newCharacterDescription}
            setNewCharacterDescription={setNewCharacterDescription}
            storyIdea={storyIdea}
            setStoryIdea={setStoryIdea}
            letAIChoose={letAIChoose}
            setLetAIChoose={setLetAIChoose}
            skipImage={skipImage}
            setSkipImage={setSkipImage}
            narratorStyle={narratorStyle}
            setNarratorStyle={setNarratorStyle}
            startStory={startStory}
            loading={loading}
            error={error}
          />
        )}
      </div>
    );
  }

  return (


    <StoryLayout characterImage={characterImage}>
      
    {/* Left: Story Reader */}
    
          <StoryDisplay
            story={story}
            loading={loading}
            input={input}
            setInput={setInput}
            continueStory={continueStory}
          />
      

    {/* Right: Buttons */}
      <StoryControls
        continueStory={continueStory}
        generateMomentImage={generateMomentImage}
        downloadStory={downloadStory}
        fetchEmpathyScores={fetchEmpathyScores}
        showDevPanel={showDevPanel}
        empathyData={empathyData}
        setShowDevPanel={setShowDevPanel}
        handleManualChapterSave={async () => {
          const res = await fetch(`${baseURL}/test-chapter`, {
            method: "POST",
          });
          const data = await res.json();
          alert(data.message);
        }}
        handleSaveAndExit={async () => {
          try {
            const res = await fetch(`${baseURL}/save-progress`, {
              method: "POST",
            });
            const data = await res.json();
            if (data.status === "ok") {
              setStarted(false);
              setStory([]);
              setCharacterImage(null);
            }
          } catch (err) {
            console.error("Failed to save progress", err);
          }
        }}
        loading={loading}
      />
      

      <DeveloperTools
        fetchEmpathyScores={fetchEmpathyScores}
        empathyData={empathyData}
        showDevPanel={showDevPanel}
        setShowDevPanel={setShowDevPanel}
        setStarted={setStarted}
        setStory={setStory}
        setCharacterImage={setCharacterImage}
      />

      <MomentImageGallery momentImages={momentImages} />
      <ErrorDisplay error={error} />
    </StoryLayout>
    
  );
}
