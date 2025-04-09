import React from "react";

export default function DeveloperTools({
  empathyData,
  showDevPanel,
  setShowDevPanel,
}) {
  if (!showDevPanel || !empathyData) return null;

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded shadow text-sm">
      <h3 className="text-lg font-bold mb-2 text-indigo-300">
        Developer: Empathy Scores
      </h3>
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
  );
}
