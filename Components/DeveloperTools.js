import React from "react";

export default function DeveloperTools({
  empathyData,
  showDevPanel,
  setShowDevPanel,
}) {
  if (!showDevPanel || !empathyData) return null;

  const traits = Object.keys(empathyData.overall_averages || {});

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded shadow text-sm max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-indigo-300">🧠 Developer: Character Traits</h3>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-white mb-1">🌐 Overall Averages</h4>
        <ul className="grid grid-cols-2 gap-x-6 text-white text-sm">
          {traits.map((trait) => (
            <li key={trait}>
              <strong className="capitalize">{trait.replace("_", " ")}:</strong> {empathyData.overall_averages[trait]}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-md font-semibold text-white mb-2">📋 Per Character</h4>
        {empathyData.characters.map((char, idx) => (
          <div key={idx} className="border-b border-gray-700 pb-4 mb-4">
            <p className="text-white mb-1">
              <strong>{char.character}</strong> (Book: <em>{char.book}</em>)
            </p>
            <ul className="grid grid-cols-2 gap-x-6 text-white text-sm">
              {traits.map((trait) => (
                <li key={trait}>
                  <strong className="capitalize">{trait.replace("_", " ")}:</strong>{" "}
                  {char.averages[trait]}{" "}
                  <span className="text-gray-400">(n={char.counts[trait]})</span>
                </li>
              ))}
            </ul>
            <details className="mt-2 text-xs text-gray-300">
              <summary className="cursor-pointer hover:text-white">🔍 View All Scores</summary>
              <ul className="mt-1">
                {traits.map((trait) => (
                  <li key={trait}>
                    <strong className="capitalize">{trait.replace("_", " ")}:</strong>{" "}
                    {char.scores[trait]?.join(", ") || "None"}
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

