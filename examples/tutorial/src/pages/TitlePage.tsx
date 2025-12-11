import { addTrack, m, playChannel, sequence } from '@ichi-h/tsuzuri-core';
import { useEffect, useRef } from 'react';
import { AUDIO_BUS_IDS, BGM } from '../constants/audio';
import { getModel, send } from '../features/game/engine';

interface TitlePageProps {
  onStartNewGame: () => void;
  onContinue: () => void;
  onOpenConfig?: () => void;
}

/**
 * Title page component
 */
export const TitlePage = ({
  onStartNewGame,
  onContinue,
  onOpenConfig,
}: TitlePageProps) => {
  const bgmInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (bgmInitializedRef.current) {
      return;
    }

    const model = getModel();
    const titleBgmExists = m.hasId(model.mixer.value, 'title-bgm');

    // Only add and play BGM if it doesn't exist yet
    if (!titleBgmExists) {
      bgmInitializedRef.current = true;

      // Add title BGM track and play it
      send(
        sequence([
          addTrack({
            id: 'title-bgm',
            src: BGM.COLORFUL_BLOCKS,
            busTrackId: AUDIO_BUS_IDS.BGM,
            volume: 1.0,
            loop: {
              start: 0,
              end: -1,
            },
          }),
          playChannel({
            channelId: 'title-bgm',
          }),
        ]),
      );
    }

    // Note: We don't remove the BGM when unmounting because
    // we want it to continue playing in the config page
    // The BGM will be removed when starting a new game or loading
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 drop-shadow-lg mb-4">
          📚 関数型ノベルゲームエンジン tsuzuri チュートリアル 📚
        </h1>
        <p className="text-gray-600 text-3xl">
          〜 キミもメッセージで駆動するのだ 〜
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onStartNewGame}
          className="px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-xl rounded-full hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
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
        {onOpenConfig && (
          <button
            type="button"
            onClick={onOpenConfig}
            className="px-12 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold text-xl rounded-full hover:from-blue-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            設定
          </button>
        )}
      </div>
    </div>
  );
};
