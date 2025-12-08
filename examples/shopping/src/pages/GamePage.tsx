import { cleanupMixer, NovelWidgetDriver } from 'driver';
import { type NovelMessage, type NovelModel, tsuzuri } from 'engine';
import { getApplyMixer } from 'libs/mixer-driver';
import { useEffect, useMemo, useState } from 'react';
import { scenarios } from '../game/scenario';

interface GamePageProps {
  initialModel: NovelModel;
  onOpenSave: (model: NovelModel) => void;
  toTitle: () => void;
}

const applyMixer = getApplyMixer();

/**
 * Get the current message from scenarios based on model state
 */
const getCurrentMessage = (model: NovelModel): NovelMessage | undefined => {
  const currentScenario = scenarios[model.currentScenario];
  if (!currentScenario) {
    return undefined;
  }
  return currentScenario[model.index];
};

/**
 * Game page component
 */
export const GamePage = ({
  initialModel,
  onOpenSave,
  toTitle,
}: GamePageProps) => {
  const [model, setModel] = useState(initialModel);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  const { createSend } = useMemo(
    () =>
      tsuzuri(() => {
        if (model.index !== 0) {
          return [model, async () => ({ type: 'ApplyMixer' })];
        }
        const initMessage = getCurrentMessage(model);
        return [
          model,
          initMessage && (async () => ({ type: 'Next', message: initMessage })),
        ];
      }, applyMixer),
    [],
  );

  const send = createSend(setModel);

  const next = () => {
    // Don't proceed if delaying, applying mixer, or awaiting user action
    if (
      model.status.value === 'Delaying' ||
      model.status.value === 'AwaitingAction' ||
      model.mixer.isApplying
    ) {
      return;
    }

    const msg = getCurrentMessage(model);
    if (!msg) {
      cleanupMixer();
      toTitle();
      return;
    }
    send({ type: 'Next', message: msg });
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSave(model);
  };

  // Auto-advance when engine requests next message
  useEffect(() => {
    if (model.status.value === 'RequestingNext') {
      const msg = getCurrentMessage(model);
      if (msg) {
        send({ type: 'Next', message: msg });
      }
    }
  }, [model, send]);

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
