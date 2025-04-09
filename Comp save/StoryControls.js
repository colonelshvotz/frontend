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

      <button
        onClick={generateMomentImage}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded w-full"
      >
        🎞 Generate Moment Image
      </button>

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
          <h3 className="text-lg font-bold mb-2 text-indigo-300">Developer: Empathy Scores</h3>
          <p className="mb-2 text-white">
            <strong>Overall Average:</strong> {empathyData.overall_average}
          </p>
          <ul className="space-y-4 text-white">
            {empathyData.characters.map((char, idx) => (
              <li key={idx} className="border-b border-gray-700 pb-2">
                <p>
                  <strong>{char.character}</strong> (Book: <em>{char.book}</em>)<br />
                  Avg: <strong>{char.average}</strong> from {char.count} entries
                </p>
                <p className="mt-1 text-xs text-gray-300">
                  Scores: {char.all_scores.join(", ")}
                </p>
              </li>
            ))}
          </ul>
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
        🧪 Manually Save Chapter
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
