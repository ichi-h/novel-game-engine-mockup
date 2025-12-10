import { NovelWidgetDriver } from '@ichi-h/tsuzuri-driver';
import { useEffect, useSyncExternalStore } from 'react';
import { getModel, send, subscribe } from '../features/game/engine';
import { scenario } from '../features/game/scenario';

interface GamePageProps {
  onOpenSave: () => void;
  onOpenConfig: () => void;
  toTitle: () => void;
}

/**
 * Game page component
 */
export const GamePage = ({
  onOpenSave,
  onOpenConfig,
  toTitle,
}: GamePageProps) => {
  const model = useSyncExternalStore(subscribe, getModel);

  const next = () => {
    if (
      model.status.value === 'Delaying' ||
      model.status.value === 'AwaitingAction'
    ) {
      return;
    }

    const message = scenario[model.index];
    if (!message) {
      send({
        type: 'ResetProperties',
        properties: [
          'animationTickets',
          'ui',
          'currentScenario',
          'history',
          'index',
          'status',
        ],
      });
      toTitle();
      return;
    }

    send({ type: 'Next', message });
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSave();
  };

  const handleOpenConfig = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfig();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => next(), []);
  useEffect(() => {
    if (model.status.value === 'RequestingNext') {
      const msg = scenario[model.index];
      if (msg) {
        send({ type: 'Next', message: msg });
      }
    }
  }, [model]);

  return (
    <div className="relative w-screen h-screen">
      {/* Game content */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Intentional */}
      <div
        className="absolute inset-0"
        onClick={next}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? next() : null)}
      >
        {/* Render novel widgets */}
        <NovelWidgetDriver widgets={model.ui} model={model} send={send} />
      </div>

      {import.meta.env.MODE === 'development' &&
        model.status.value === 'Error' && (
          <div className="absolute inset-0 bg-red-100 bg-opacity-80 flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              エラーが発生しました
            </h2>
            <pre className="bg-white p-4 rounded-lg shadow-md max-w-full overflow-x-auto text-left text-red-700">
              {model.status.error.message}
            </pre>
          </div>
        )}

      {/* Menu buttons */}
      <div className="absolute bottom-4 right-4 z-50 flex gap-3">
        <button
          type="button"
          onClick={handleOpenSave}
          className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all text-2xl"
          aria-label="セーブを開く"
        >
          💾
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all text-2xl"
          aria-label="ロードを開く"
        >
          📂
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all text-2xl"
          aria-label="スキップモード切替"
        >
          ⏩
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all text-2xl"
          aria-label="ログを開く"
        >
          📜
        </button>
        <button
          type="button"
          onClick={handleOpenConfig}
          className="w-12 h-12 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/90 transition-all text-2xl"
          aria-label="設定を開く"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};
