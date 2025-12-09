import { useId } from 'react';
import { useConfig } from '../features/config/useConfig';

export interface ConfigPageProps {
  onBack: () => void;
}

/**
 * Configuration page for adjusting game settings
 */
export const ConfigPage = ({ onBack }: ConfigPageProps) => {
  const {
    config,
    updateBgmVolume,
    updateSeVolume,
    updateTextSpeed,
    resetConfig,
  } = useConfig();
  const bgmVolumeId = useId();
  const seVolumeId = useId();
  const textSpeedId = useId();

  const handleReset = () => {
    const confirmed = window.confirm('設定を初期値に戻しますか?');
    if (confirmed) {
      resetConfig();
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">⚙️ 設定</h1>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow hover:bg-white transition-colors text-gray-700 font-medium"
        >
          戻る
        </button>
      </div>

      {/* Config Controls */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* BGM Volume */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <label
              htmlFor={bgmVolumeId}
              className="block text-lg font-semibold text-gray-800 mb-3"
            >
              BGM音量
            </label>
            <div className="flex items-center gap-4">
              <input
                id={bgmVolumeId}
                type="range"
                min="0"
                max="100"
                value={config.bgmVolume * 100}
                onChange={(e) => updateBgmVolume(Number(e.target.value) / 100)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-gray-700 font-medium w-12 text-right">
                {Math.round(config.bgmVolume * 100)}%
              </span>
            </div>
          </div>

          {/* SE Volume */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <label
              htmlFor={seVolumeId}
              className="block text-lg font-semibold text-gray-800 mb-3"
            >
              SE音量
            </label>
            <div className="flex items-center gap-4">
              <input
                id={seVolumeId}
                type="range"
                min="0"
                max="100"
                value={config.seVolume * 100}
                onChange={(e) => updateSeVolume(Number(e.target.value) / 100)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-gray-700 font-medium w-12 text-right">
                {Math.round(config.seVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Text Speed */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <label
              htmlFor={textSpeedId}
              className="block text-lg font-semibold text-gray-800 mb-3"
            >
              テキスト速度
            </label>
            <div className="flex items-center gap-4">
              <input
                id={textSpeedId}
                type="range"
                min="0"
                max="100"
                value={config.textSpeed * 100}
                onChange={(e) => updateTextSpeed(Number(e.target.value) / 100)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-gray-700 font-medium w-12 text-right">
                {Math.round(config.textSpeed * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              値が大きいほど速く表示されます
            </p>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 bg-gray-500/80 hover:bg-gray-500 text-white font-semibold rounded-lg shadow transition-colors"
            >
              設定を初期値に戻す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
