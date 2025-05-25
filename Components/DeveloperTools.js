import React from "react";

export default function DeveloperTools({
  empathyData, // Consider renaming this prop to 'traitData' or 'devData' for clarity
  showDevPanel,
  setShowDevPanel,
}) {
  if (!showDevPanel || !empathyData) return null;

  const traits = Object.keys(empathyData.overall_averages || {});
  const overallPersonality = empathyData.overall_personality || {}; // <-- ADDED

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded shadow text-sm max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-indigo-300">🧠 Developer: Character Traits & Analysis</h3>

      <div className="mb-6 p-4 bg-gray-700 rounded">
        <h4 className="text-md font-semibold text-white mb-2">🌐 Overall Analysis</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 text-white text-sm mb-3">
            {/* --- NEW: Display Overall Personality --- */}
            <li><strong>MBTI:</strong> {overallPersonality.mbti_type || 'N/A'}</li>
            <li><strong>Hogwarts:</strong> {overallPersonality.hogwarts_house || 'N/A'}</li>
            <li><strong>LotR Race:</strong> {overallPersonality.lotr_race || 'N/A'}</li>
            {/* --- END NEW --- */}
        </div>
         <h5 className="text-sm font-semibold text-gray-300 mb-1">Overall Averages:</h5>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 text-white text-xs">
          {traits.map((trait) => (
            <li key={trait}>
              <strong className="capitalize">{trait.replace(/_/g, " ").replace(/-/g, " ")}:</strong> {empathyData.overall_averages[trait]}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-md font-semibold text-white mb-2">📋 Per Character Analysis</h4>
        {empathyData.characters.map((char, idx) => (
          <div key={idx} className="border-b border-gray-700 pb-4 mb-4">
            <div className="flex justify-between items-center mb-1">
                <p className="text-white font-bold">
                  {char.character} <span className="font-normal text-gray-400">(Book: <em>{char.book}</em>)</span>
                </p>
                {/* --- NEW: Display Character Personality --- */}
                <div className="text-right text-xs text-indigo-200">
                   <span>{char.personality?.mbti_type || ''}</span> /{' '}
                   <span>{char.personality?.hogwarts_house || ''}</span> /{' '}
                   <span>{char.personality?.lotr_race || ''}</span>
                </div>
                 {/* --- END NEW --- */}
            </div>

            <ul className="grid grid-cols-2 gap-x-6 text-white text-sm">
              {Object.entries(char.traits).map(([trait, stat]) => (
                <li key={trait}>
                  <strong className="capitalize">{trait.replace(/_/g, " ").replace(/-/g, " ")}:</strong> {stat.average}{" "}
                  <span className="text-gray-400">(n={stat.count})</span>
                </li>
              ))}
            </ul>

            <details className="mt-2 text-xs text-gray-300">
              <summary className="cursor-pointer hover:text-white">🔍 View All Scores</summary>
              <ul className="mt-1 grid grid-cols-2 gap-x-6">
                {Object.entries(char.traits).map(([trait, stat]) => (
                  <li key={trait}>
                    <strong className="capitalize">{trait.replace(/_/g, " ").replace(/-/g, " ")}:</strong>{" "}
                    {stat.all_scores?.join(", ") || "None"}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowDevPanel(false)}
        className="mt-4 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
      >
        Close Panel
      </button>
    </div>
  );
}
