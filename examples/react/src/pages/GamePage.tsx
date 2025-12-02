import { cleanupMixer, NovelWidgetDriver } from 'driver';
import { ElmishState, elmish } from 'elmish';
import {
  historyMiddleware,
  type NovelMessage,
  type NovelModel,
  textAnimationMiddleware,
  update,
} from 'engine';
import { getApplyMixer } from 'libs/mixer-driver';
import { useMemo, useState } from 'react';
import { messages } from '../game/scenario';

interface GamePageProps {
  initialModel: NovelModel;
  onOpenSave: (model: NovelModel) => void;
  toTitle: () => void;
}

const applyMixer = getApplyMixer();

/**
 * Game page component
 */
export const GamePage = ({
  initialModel,
  onOpenSave,
  toTitle,
}: GamePageProps) => {
  const [model, setModel] = useState(initialModel);

  // Create a new elmish state for each GamePage instance
  const useElement = useMemo(
    () => elmish<NovelModel, NovelMessage>(new ElmishState()),
    [],
  );

  const send = useElement(
    () => {
      if (model.index !== 0) {
        return [model, async () => ({ type: 'ApplyMixer' })];
      }
      const initMessage = messages[0];
      return [model, initMessage && (async () => initMessage)];
    },
    update(applyMixer, [historyMiddleware, textAnimationMiddleware]),
    setModel,
  );

  const next = () => {
    if (model.isDelaying || model.isApplyingMixer) {
      return;
    }

    const msg = messages[model.index];
    if (!msg) {
      cleanupMixer();
      toTitle();
      return;
    }
    send(msg);
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSave(model);
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Game content */}
      {/* biome-ignore lint/a11y/useSemanticElements: Special UI for making the entire game screen clickable */}
      <div
        className="absolute inset-0"
        onClick={next}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            next();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="次のシーンへ進む"
      >
        <NovelWidgetDriver widgets={model.ui} model={model} />
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
