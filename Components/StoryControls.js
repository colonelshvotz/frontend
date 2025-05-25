import React from "react";
// --- (1) IMPORT YOUR NEW COMPONENT ---
import DeveloperTools from './DeveloperTools'; // <-- Make sure this path is correct!

// Keep this line if you use it, otherwise remove it.
// const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

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
  isExporting,
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
        disabled={isExporting}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
          isExporting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isExporting ? 'Exporting...' : '📤 Export Story to Word Doc'}
      </button>

      <button
        onClick={fetchEmpathyScores}
        className="mt-4 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        {/* You might want to rename this button for clarity */}
        🧠 View Character Analysis
      </button>

      {/* --- (2) REPLACE THE OLD PANEL WITH THE NEW COMPONENT --- */}
      {showDevPanel && empathyData && (
        <DeveloperTools
            empathyData={empathyData}
            showDevPanel={showDevPanel}
            setShowDevPanel={setShowDevPanel}
        />
      )}
      {/* --- THE OLD DIV BLOCK HAS BEEN REMOVED --- */}


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
