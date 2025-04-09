import React from "react";

export default function MomentImageGallery({ momentImages }) {
  if (!momentImages || momentImages.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {momentImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Story Moment ${index + 1}`}
          className="rounded shadow"
        />
      ))}
    </div>
  );
}
