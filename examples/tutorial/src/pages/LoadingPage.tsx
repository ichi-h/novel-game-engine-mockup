import { useEffect, useState } from 'react';
import { useAssetPreloader } from '@/hooks/useAssetPreloader';

interface LoadingPageProps {
  onComplete: () => void;
}

/**
 * Loading and audio confirmation page
 * Shows loading progress, then transitions to audio confirmation within the same box
 */
export const LoadingPage = ({ onComplete }: LoadingPageProps) => {
  const progress = useAssetPreloader();
  const [showAudioConfirm, setShowAudioConfirm] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (progress.isComplete && !showAudioConfirm && !isTransitioning) {
      setIsTransitioning(true);
      // Fade out loading content
      const timer = setTimeout(() => {
        setShowAudioConfirm(true);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [progress.isComplete, showAudioConfirm, isTransitioning]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl max-w-lg w-full mx-4 p-12 text-center shadow-2xl border border-white/20 min-h-[400px] flex items-center justify-center">
        {!progress.isComplete ? (
          // ローディング表示
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-6xl mb-6 animate-pulse">📚</div>
            <h1 className="text-3xl font-bold text-white mb-6">
              読み込み中...
            </h1>
            <div className="w-full max-w-md bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-gray-300 text-lg mb-2">
              {progress.loaded} / {progress.total} アセット
            </p>
            <p className="text-gray-400 text-sm">{progress.percentage}%</p>
          </div>
        ) : (
          // 音声確認表示
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-6xl mb-6">🔊</div>
            <h1 className="text-3xl font-bold text-white mb-6">音声について</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              このゲームでは音声が流れます。
              <br />
              音量にご注意ください。
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-full hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              確認してゲームを開始
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
