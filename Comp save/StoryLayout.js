// components/StoryLayout.js
import React from "react";

export default function StoryLayout({ characterImage, children }) {
  const [storySection, controlsSection] = React.Children.toArray(children);

  return (
    <div className="h-screen bg-gray-900 text-white px-4 py-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col h-full">
        {characterImage && (
          <div className="mb-4 text-center">
            <img
              src={characterImage}
              alt="Character Portrait"
              className="inline-block rounded shadow-lg max-h-64"
            />
          </div>
        )}

        <div className="flex-1 flex md:flex-row gap-6 overflow-hidden">
          {/* Left: Story area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {storySection}
          </div>

          {/* Right: Controls */}
          <div className="w-full md:w-80 flex-shrink-0">
            {controlsSection}
          </div>
        </div>
      </div>
    </div>
  );
}
