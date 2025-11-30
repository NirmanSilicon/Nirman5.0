import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, List, CreditCard, ThumbsUp, ThumbsDown } from "lucide-react";

export function Flashcards({ onNavigate }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState("flip");
  const [knownCards, setKnownCards] = useState(new Set());

  const flashcards = [
    {
      front: "What is the definition of a limit?",
      back: "A limit is the value that a function approaches..."
    },
    {
      front: "State the Power Rule for derivatives",
      back: "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹"
    },
    {
      front: "What is the Chain Rule?",
      back: "If y = f(g(x)), then dy/dx = f'(g(x))·g'(x)"
    },
    {
      front: "Define continuity at a point",
      back: "A function is continuous at x = a if..."
    },
    {
      front: "What is the Fundamental Theorem of Calculus?",
      back: "Part 1: ∫ f(x)dx = F(b) - F(a), Part 2: d/dx ∫ f(t)dt = f(x)"
    }
  ];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleKnown = () => {
    setKnownCards(new Set([...knownCards, currentCard]));
    handleNext();
  };

  const handleUnknown = () => handleNext();

  const progress = (knownCards.size / flashcards.length) * 100;

  return (
    <div className="min-h-screen bg-[#ADD8E6]">
      
      {/* 🔹 Manual Navigation */}
      <div className="w-full bg-white py-4 px-8 shadow-md flex gap-4">
        <button className="text-gray-900" onClick={() => onNavigate("dashboard")}>Dashboard</button>
        <button className="text-gray-900" onClick={() => onNavigate("analytics")}>Analytics</button>
        <button className="text-gray-900" onClick={() => onNavigate("upload")}>Upload</button>
        <button className="ml-auto px-4 py-2 rounded-lg bg-[#0000FF] text-white" onClick={() => onNavigate("flashcards")}>
          Flashcards
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">Flashcards</h1>
            <p className="text-xl text-gray-600">Advanced Calculus - Limits & Derivatives</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("flip")}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                viewMode === "flip"
                  ? "bg-[#0000FF] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Flip Mode
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-[#0000FF] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
              List Mode
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3xl p-6 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Cards Mastered</span>
            <span className="text-gray-900">{knownCards.size} / {flashcards.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 bg-[#0000FF] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {viewMode === "flip" ? (
          <>
            {/* Flip Card */}
            <div className="mb-8">
  <div
    onClick={() => setIsFlipped(!isFlipped)}
    className="bg-white rounded-3xl p-12 min-h-[400px] flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all relative"
    style={{
      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
      transformStyle: "preserve-3d",
      transition: "transform 0.6s"
    }}
  >

    {/* FRONT */}
    <div
      className="absolute inset-0 flex flex-col items-center justify-center backface-hidden"
      style={{ transform: "rotateY(0deg)" }}
    >
      <div className="text-center">
        <div className="text-sm text-[#0000FF] mb-4">QUESTION</div>
        <h2 className="text-3xl text-gray-900 mb-6">{flashcards[currentCard].front}</h2>
        <div className="text-gray-500 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Click to flip
        </div>
      </div>
    </div>

    {/* BACK */}
    <div
      className="absolute inset-0 flex flex-col items-center justify-center backface-hidden"
      style={{ transform: "rotateY(180deg)" }}
    >
      <div className="text-center">
        <div className="text-sm text-green-600 mb-4">ANSWER</div>
        <p className="text-xl text-gray-900 leading-relaxed">
          {flashcards[currentCard].back}
        </p>
      </div>
    </div>

    <div className="absolute top-6 right-6 px-4 py-2 bg-[#ADD8E6]/30 rounded-xl text-gray-700">
      {currentCard + 1} / {flashcards.length}
    </div>
  </div>
</div>


            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevious}
                className="px-6 py-4 bg-white text-gray-700 rounded-2xl hover:bg-gray-100 transition flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>

              <div className="flex-1 flex gap-4">
                <button
                  onClick={handleUnknown}
                  className="flex-1 px-6 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  <ThumbsDown className="w-5 h-5" /> Unknown
                </button>
                <button
                  onClick={handleKnown}
                  className="flex-1 px-6 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-5 h-5" /> Known
                </button>
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-4 bg-white text-gray-700 rounded-2xl hover:bg-gray-100 transition flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          // 📄 List View
          <div className="space-y-4">
            {flashcards.map((card, index) => {
              const isKnown = knownCards.has(index);

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-6 border-2 ${
                    isKnown ? "border-green-200 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 bg-[#0000FF] rounded-lg flex items-center justify-center text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="text-sm text-[#0000FF] mb-2">QUESTION</div>
                        <div className="text-lg text-gray-900">{card.front}</div>
                      </div>

                      <div className="pt-4 border-t-2 border-gray-200">
                        <div className="text-sm text-green-600 mb-2">ANSWER</div>
                        <div className="text-gray-700">{card.back}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const newKnown = new Set(knownCards);
                        isKnown ? newKnown.delete(index) : newKnown.add(index);
                        setKnownCards(newKnown);
                      }}
                      className={`px-4 py-2 rounded-xl transition ${
                        isKnown
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {isKnown ? "Known" : "Mark Known"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
