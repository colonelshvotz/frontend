import React from "react";

export default function StoryControls({
  continueStory,
  generateMomentImage,
  downloadStory,
  fetchEmpathyScores,
  showDevPanel,
  empathyData,
  setShowDevPanel,
  handleManualChapterSave,
  handleSaveAndExit,
  loading,
}) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={continueStory}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded w-full"
      >
        {loading ? "Continuing..." : "Submit Action"}
      </button>

      {false && (<button
        onClick={generateMomentImage}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded w-full"
      >
        🎞 Generate Moment Image
      </button>
      )}

      <button
        onClick={downloadStory}
        className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded w-full"
      >
        📄 Download Story as Word Doc
      </button>

      <button
        onClick={fetchEmpathyScores}
        className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        🧠 View Empathy Scores
      </button>

      {showDevPanel && empathyData && (
  <div className="mt-4 bg-gray-800 p-4 rounded shadow text-sm">
    <h3 className="text-lg font-bold mb-4 text-indigo-300">Developer: Character Traits</h3>
    {empathyData.characters.map((char, idx) => (
      <div key={idx} className="border-b border-gray-700 pb-4 mb-4">
        <p className="text-white mb-2">
          <strong>{char.character}</strong> (Book: <em>{char.book}</em>)
        </p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-200 text-sm">
          {Object.entries(char.traits).map(([trait, stats]) => (
            <li key={trait}>
              <strong className="capitalize">{trait}:</strong>{" "}
              Avg: {stats.average.toFixed(1)} | Count: {stats.count}
              <br />
              <span className="text-xs text-gray-400">
                Scores: {stats.all_scores.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
    <button
      onClick={() => setShowDevPanel(false)}
      className="mt-4 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
    >
      Close Panel
    </button>
  </div>
)}


      <button
        onClick={handleManualChapterSave}
        className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded mt-4"
      >
        🧪 Save Chapter
      </button>

      <button
        onClick={handleSaveAndExit}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
      >
        📚 Save and Exit to Bookshelf
      </button>
    </div>
  );
}
