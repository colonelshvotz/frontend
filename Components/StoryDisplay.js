import React from "react";

export default function StoryDisplay({ story, loading, input, setInput, continueStory }) {
  return (
    <div className="flex flex-col h-full">
      {/* Story text area */}
      <div className="flex-1 bg-gray-800 p-4 rounded overflow-y-auto whitespace-pre-wrap">
        {story.map((chunk, i) => (
          <p key={i} className="mb-3">{chunk}</p>
        ))}
        {loading && <p className="italic text-gray-400">Thinking...</p>}
      </div>

      {/* Input box */}
      <input
        className="w-full p-3 mt-4 rounded bg-gray-800 text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What do you do next?"
        onKeyDown={(e) => e.key === "Enter" && continueStory()}
      />
    </div>
  );
}
