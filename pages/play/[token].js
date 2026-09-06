// pages/play/[token].js
//
// Simplified story page for one-time invite links.
// Place this file at: pages/play/[token].js in your Next.js frontend.
//
// This page:
// - Validates the invite token on load
// - Shows an error if the token is invalid, expired, or already used
// - Starts the story automatically
// - Provides only the story display and input (no other controls)
// - Shows a completion message when the story ends

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import StoryDisplay from "../../Components/StoryDisplay";

export default function PlayInvitePage() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [story, setStory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [idNumber, setIdNumber] = useState(""); // participant-entered value

  const baseURL = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");

  // Validate token on mount
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      setStatus("validating");
      try {
        const res = await fetch(`${baseURL}/invite/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.detail || "Invalid invite link.");
          setStatus("error");
          return;
        }

        setStatus("ready");
      } catch (err) {
        console.error("Error validating token:", err);
        setError("Failed to validate invite link. Please try again later.");
        setStatus("error");
      }
    };

    validateToken();
  }, [token, baseURL]);

  // Start the story
  const startStory = async () => {
    if (!idNumber.trim()) {
      setError("Please enter your ID number.");
      return;
    }

    setLoading(true);
    setStatus("playing");

    try {
      const res = await fetch(`${baseURL}/start-invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character_name: idNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to start story.");
        setStatus("error");
        return;
      }

      setStory([data.story]);
      setCharacterName(data.character_name);
    } catch (err) {
      console.error("Error starting story:", err);
      setError("Failed to start story. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Continue the story
  const continueStory = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userInput = input;
    setInput("");

    setStory((prev) => [...prev, `> ${userInput}`]);

    try {
      const res = await fetch(`${baseURL}/continue-invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to continue story.");
        return;
      }

      setStory((prev) => [...prev, data.story]);

      if (data.ended) {
        setStatus("ended");
      }
    } catch (err) {
      console.error("Error continuing story:", err);
      setError("Failed to continue story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // === RENDER ===

  if (status === "loading" || status === "validating") {
    return (
      <div className="min-h-screen bg-[#12110f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Validating your story link...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#12110f] text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold mb-4 text-red-400">Unable to Access Story</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact the person who sent you this link.
          </p>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div className="min-h-screen bg-[#12110f] text-white flex items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-3xl font-bold mb-2">Your Story Awaits</h1>
          <p className="text-gray-400 mb-6">
            You're about to begin an interactive session.
          </p>

          <div className="mb-6 text-left">
            <label className="block text-sm text-gray-400 mb-1">ID Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Enter your ID number"
              className="w-full p-3 bg-gray-700 rounded text-white"
              autoFocus
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left text-sm text-gray-300">
            <p className="mb-2"><strong>⚠️ Important:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>This is a one-time experience</li>
              <li>Once you start, you cannot pause or restart</li>
              <li>Closing your browser will end the session</li>
              <li>Make your choices count!</li>
            </ul>
          </div>
          <button
            onClick={startStory}
            disabled={loading || !idNumber.trim()}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xl font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Starting..." : "Begin Your Adventure"}
          </button>
        </div>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="min-h-screen bg-[#12110f] text-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6 max-h-[60vh] overflow-y-auto">
            {story.map((chunk, i) => (
              <p key={i} className="mb-3 whitespace-pre-wrap">{chunk}</p>
            ))}
          </div>

          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-3xl font-bold mb-4">Your Story Has Concluded</h1>
            <p className="text-gray-400 mb-6">
              Thank you for your participation.
            </p>
            <p className="text-sm text-gray-500">
              This session has been recorded for analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-[#12110f] text-white flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Interactive Session</h1>
          </div>
          <div className="text-xs text-gray-500">
            Interactive Story Session
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-hidden">
        <div className="max-w-3xl mx-auto h-full">
          <StoryDisplay
            story={story}
            loading={loading}
            input={input}
            setInput={setInput}
            continueStory={continueStory}
          />
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-red-900 text-white p-4 rounded-lg">
          <p>{error}</p>
          <button onClick={() => setError("")} className="mt-2 text-sm underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
