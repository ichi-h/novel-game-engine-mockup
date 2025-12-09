import { NovelWidgetDriver } from '@ichi-h/tsuzuri-driver';
import { useSyncExternalStore } from 'react';
import { getModel, send, subscribe } from '../features/game/engine';
import { scenario } from '../features/game/scenario';

interface GamePageProps {
  onOpenSave: () => void;
  toTitle: () => void;
}

/**
 * Game page component
 */
export const GamePage = ({ onOpenSave, toTitle }: GamePageProps) => {
  const model = useSyncExternalStore(subscribe, getModel);

  const next = () => {
    const message = scenario[model.index];
    console.log(message);
    if (!message) {
      console.log('Scenario finished');
      toTitle();
      return;
    }
    send({ type: 'Next', message });
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSave();
  };

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

      {/* Menu button */}
      <button
        type="button"
        onClick={handleOpenSave}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors text-gray-700 font-medium"
        aria-label="メニューを開く"
      >
        💾 セーブ
      </button>
    </div>
  );
};
