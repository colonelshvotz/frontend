import React from "react";
import { useEffect } from "react";

export default function BookSelection({
  books,
  setBooks,
  selectedBook,
  setSelectedBook,
  setSelectedCharacter,
  setIsNewBook,
  isNewBook,
  newBookTitle,
  setNewBookTitle,
  genre,
  setGenre
}) {
  useEffect(() => {
    fetch(`${API}/list-books`)
      .then((res) => res.json())
      .then((data) => setBooks(data.books || []))
      .catch((err) => console.error("Failed to load books", err));
  }, []);
  return (
    <div className="max-w-2xl mx-auto bg-[#1e1a16] border border-yellow-900 p-6 rounded-md shadow-lg">
      <h2 className="text-2xl font-serif mb-4 border-b border-yellow-900 pb-2">
        📚 Choose or Create a Story World
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        {books.map((book, idx) => (
          <div
            key={idx}
            className={`group relative w-12 h-32 bg-yellow-800 hover:bg-yellow-600 text-white cursor-pointer flex items-center justify-center rounded-sm transition-all duration-300 ${
              selectedBook === book.title ? "ring-4 ring-yellow-400" : ""
            }`}
            onClick={() => {
              setSelectedBook(book.title);
              setSelectedCharacter("");
              setIsNewBook(false);
            }}
          >
            <span className="rotate-90 text-xs font-bold whitespace-nowrap">
              {book.title}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-sm rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
              <strong>{book.title}</strong>
              <br />
              {book.characters && book.characters.length > 0 ? (
                <ul className="mt-1 list-disc list-inside text-xs">
                  {book.characters.map((char, i) => (
                    <li key={i}>{char}</li>
                  ))}
                </ul>
              ) : (
                <em className="text-xs">No characters</em>
              )}
            </div>
          </div>
        ))}

        {/* New Book Button */}
        <button
          onClick={() => setIsNewBook(true)}
          className="w-12 h-32 bg-gray-700 hover:bg-gray-600 text-white text-3xl font-bold rounded-sm flex items-center justify-center"
          title="Create a new book"
        >
          +
        </button>
      </div>

      <button
        onClick={() => setIsNewBook(true)}
        className="mt-2 text-yellow-400 hover:text-yellow-200 underline"
      >
        + Create a new Book
      </button>

      {isNewBook && (
        <div className="mt-4">
          <input
            className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white mb-2"
            placeholder="New Book Title"
            value={newBookTitle}
            onChange={(e) => setNewBookTitle(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-[#2c261f] border border-yellow-700 text-white"
            placeholder="Genre (e.g., Western, Sci-Fi)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
