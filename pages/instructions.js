import { useRouter } from "next/router";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#12110f] text-white px-6 py-10 flex flex-col items-center justify-center">
      <div className="max-w-2xl bg-[#1e1a16] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-300">✨ Welcome to Main Character ✨</h1>
        <p className="mb-4">
        This is a virtual bookshelf! Create a new book, set its genre, then create your first main character for your first chapter by naming them, describing them physically for your portrait, then creating a prompt for your first chapter or letting the system make one up for you.
        </p>
        <p className="mb-4">
        In this adventure, you control the main character, and you write a novel with your decisions. You'll explore, make decisions, and shape the world. You decide what happens next. The AI follows you - if you want it to happen, it'll happen.
        </p>
        <p className="mb-4">
        When you're happy with the arc of your chapter, select 'Save Chapter' then 'Exit to Bookshelf' if you want to start the next chapter with a new character. The characters in the book will remember everything you've done.
        </p>
        <p className="mb-6">
          When you're ready, click below to create your story world and character. Be creative, adventurous, and curious!
        </p>

        <button
          onClick={() => router.push("/bookshelf")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition mt-6"
        >
          🚀 Start Creating!
        </button>
      </div>
    </div>
  );
}
