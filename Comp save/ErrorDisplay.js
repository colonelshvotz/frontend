// Components/ErrorDisplay.js
export default function ErrorDisplay({ error }) {
    if (!error) return null;
  
    return (
      <p className="text-red-500 mt-3 text-center">{error}</p>
    );
  }
  