interface TitlePageProps {
  onStartNewGame: () => void;
  onContinue: () => void;
}

/**
 * Title page component
 */
export const TitlePage = ({ onStartNewGame, onContinue }: TitlePageProps) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 drop-shadow-lg mb-4">
          🛍️ ショッピングモールへ行こう！ 🛍️
        </h1>
        <p className="text-gray-600 text-lg">
          〜BunちゃんとReactくんとの休日〜
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onStartNewGame}
          className="px-12 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold text-xl rounded-full hover:from-pink-500 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          はじめから
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-12 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold text-xl rounded-full hover:from-purple-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          つづきから
        </button>
      </div>
    </div>
  );
};
