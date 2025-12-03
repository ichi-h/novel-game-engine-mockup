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
import { useEffect, useMemo, useRef, useState } from 'react';
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
      const initMessage = getCurrentMessage(model);
      return [
        model,
        initMessage && (async () => ({ type: 'Next', message: initMessage })),
      ];
    },
    update(applyMixer, [historyMiddleware, textAnimationMiddleware]),
    setModel,
  );

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

  // Track previous scenario to detect scenario switches
  const prevScenarioRef = useRef(model.currentScenario);

  // Auto-advance when scenario switches
  useEffect(() => {
    if (prevScenarioRef.current !== model.currentScenario) {
      prevScenarioRef.current = model.currentScenario;
      // Scenario has switched, send the first message of the new scenario
      const msg = getCurrentMessage(model);
      if (msg && model.status.value === 'Processed') {
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
