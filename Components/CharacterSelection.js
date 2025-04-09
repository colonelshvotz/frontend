import React from "react";

export default function CharacterSelection({
  books,
  selectedBook,
  selectedCharacter,
  setSelectedCharacter,
  isNewBook,
  newCharacterName,
  setNewCharacterName,
  newCharacterDescription,
  setNewCharacterDescription,
  storyIdea,
  setStoryIdea,
  letAIChoose,
  setLetAIChoose,
  skipImage,
  setSkipImage,
  narratorStyle,
  setNarratorStyle,
  startStory,
  loading,
  error,
}) {
  const bookData = books.find((b) => b.title === selectedBook);

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-[#1e1a16] border border-yellow-900 p-6 rounded-md shadow-lg">
      <h3 className="text-xl font-serif mb-4 border-b border-yellow-900 pb-2">
        👤 Choose or Create a Character
      </h3>

      {!isNewBook && (
        <>
          <label className="block mb-1 font-semibold text-yellow-200">
            Select Character:
          </label>
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white"
          >
            <option value="">-- Choose --</option>
            {Array.isArray(bookData?.characters) &&
              bookData.characters.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
          </select>
        </>
      )}

      <div className="mt-4">
        <label className="block mb-1 font-semibold text-yellow-200">
          Or Create New:
        </label>
        <input
          className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white mb-2"
          placeholder="New Character Name"
          value={newCharacterName}
          onChange={(e) => setNewCharacterName(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white mb-2"
          placeholder="Character Description"
          value={newCharacterDescription}
          onChange={(e) => setNewCharacterDescription(e.target.value)}
        />
        <label className="block mb-1">What do you want your story to be about?</label>
        <textarea
          className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white mb-2"
          value={storyIdea}
          onChange={(e) => setStoryIdea(e.target.value)}
          disabled={letAIChoose}
          placeholder="e.g., revenge, lost treasure..."
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={letAIChoose}
            onChange={() => setLetAIChoose(!letAIChoose)}
            className="mr-2"
          />
          <label>Let the AI come up with the story</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={skipImage}
            onChange={() => setSkipImage(!skipImage)}
            className="mr-2"
          />
          <label>Skip image generation (testing mode)</label>
        </div>

        <label className="block mt-4">
  <span className="text-gray-700 font-medium">Narrator Style</span>
  <select
    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    value={narratorStyle}
    onChange={(e) => setNarratorStyle(e.target.value)}
    
  >
    <option value="neutral">Neutral</option>
    <option value="snarky">Snarky AI</option>
    <option value="wise">Wise storyteller</option>
    <option value="poetic">Poetic and lyrical</option>
    <option value="noir">Hardboiled Noir</option>
    <option value="fantastical">Hard Fantasy</option>
  </select>
</label>

        <button
          onClick={startStory}
          disabled={loading}
          className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow-md w-full"
        >
          {loading ? "Loading..." : "🚀 Begin Adventure"}
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}
