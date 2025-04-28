import React from "react";

import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function ChapterList({ selectedBook, books }) {
  const book = books.find((b) => b.title === selectedBook);

  if (!book?.chapters?.length) return null;

  return (
    <div className="mt-6 bg-[#1e1a16] border border-yellow-900 p-4 rounded-md shadow">
      <h4 className="text-lg font-bold mb-2 text-yellow-300">📖 Completed Chapters</h4>
      <ul className="space-y-2">
        {book.chapters.map((ch, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-[#2c261f] p-2 rounded"
          >
            <div>
              <strong>Chapter {idx + 1}</strong> — <em>{ch.character}</em>
              <p className="text-sm text-gray-300">{ch.summary}</p>
            </div>
            <button
              onClick={async () => {
                const res = await fetch(
                  `${API}/export-chapter/${encodeURIComponent(selectedBook)}/${idx}`
                );
                const data = await res.json();

                // Convert base64 back to blob
                const byteCharacters = atob(data.filedata);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
              
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Chapter_${idx + 1}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
              }}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              📥 Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
