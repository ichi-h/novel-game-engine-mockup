import { NovelWidgetDriver } from '@ichi-h/tsuzuri-driver';
import { useEffect, useSyncExternalStore } from 'react';
import { getModel, send, subscribe } from '../features/game/engine';
import { scenario } from '../features/game/scenario';

interface GamePageProps {
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenConfig: () => void;
  onOpenBacklog: () => void;
  onBackToTitle: () => void;
  onGameEnd: () => void;
}

/**
 * Game page component
 */
export const GamePage = ({
  onOpenSave,
  onOpenLoad,
  onOpenConfig,
  onOpenBacklog,
  onBackToTitle,
  onGameEnd,
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
      setTimeout(() => {
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
      }, 1000);
      onGameEnd();
      return;
    }

    send({ type: 'Next', message });
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSave();
  };

  const handleOpenLoad = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenLoad();
  };

  const handleOpenConfig = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfig();
  };

  const handleOpenBacklog = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenBacklog();
  };

  const handleBackToTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBackToTitle();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    model.index === 0 && next();
  }, []);
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
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all text-2xl saturate-0 opacity-50 hover:opacity-100 hover:saturate-100"
          aria-label="セーブを開く"
        >
          💾
        </button>
        <button
          type="button"
          onClick={handleOpenLoad}
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all text-2xl saturate-0 opacity-50 hover:opacity-100 hover:saturate-100"
          aria-label="ロードを開く"
        >
          📂
        </button>
        <button
          type="button"
          onClick={handleOpenBacklog}
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all text-2xl saturate-0 opacity-50 hover:opacity-100 hover:saturate-100"
          aria-label="バックログを開く"
        >
          📜
        </button>
        <button
          type="button"
          onClick={handleOpenConfig}
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all text-2xl saturate-0 opacity-50 hover:opacity-100 hover:saturate-100"
          aria-label="設定を開く"
        >
          ⚙️
        </button>
        <button
          type="button"
          onClick={handleBackToTitle}
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all text-2xl saturate-0 opacity-50 hover:opacity-100 hover:saturate-100"
          aria-label="タイトルへ戻る"
        >
          🏠
        </button>
      </div>
    </div>
  );
};
