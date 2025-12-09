interface AudioConfirmPageProps {
  onConfirm: () => void;
}

/**
 * Audio confirmation page - shown before title screen
 * Required for browser games that play audio
 */
export const AudioConfirmPage = ({ onConfirm }: AudioConfirmPageProps) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 max-w-lg text-center shadow-2xl border border-white/20">
        <div className="text-6xl mb-6">🔊</div>
        <h1 className="text-3xl font-bold text-white mb-6">音声について</h1>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          このゲームでは音声が流れます。
          <br />
          音量にご注意ください。
        </p>
        <button
          type="button"
          onClick={onConfirm}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-full hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          確認してゲームを開始
        </button>
      </div>
    </div>
  );
};
