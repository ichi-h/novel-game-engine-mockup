import { removeChannel, sequence } from '@ichi-h/tsuzuri-core';
import { useCallback, useState } from 'react';
import { FadeTransition } from '@/components/FadeTransition';
import { SE } from '@/constants/audio';
import { playSE } from '@/features/game/se';
import { buildConfigMessages } from '../features/config/applyConfig';
import { useConfig } from '../features/config/useConfig';
import { send } from '../features/game/engine';
import { AudioConfirmPage } from '../pages/AudioConfirmPage';
import { ConfigPage } from '../pages/ConfigPage';
import { GamePage } from '../pages/GamePage';
import { LoadPage } from '../pages/LoadPage';
import { SavePage } from '../pages/SavePage';
import { TitlePage } from '../pages/TitlePage';

export type RouterState =
  | { page: 'audio-confirm' }
  | { page: 'title' }
  | { page: 'game' }
  | { page: 'save' }
  | { page: 'load' }
  | { page: 'config'; from: 'title' | 'game' };

export const Router = () => {
  const { config } = useConfig();
  const [routerState, setRouterState] = useState<RouterState>({
    page: 'audio-confirm',
  });
  const [isFading, setIsFading] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  // Navigate with fade transition
  const navigateWithFade = useCallback((newState: RouterState) => {
    setIsFading(true);
    setPendingNavigation(() => () => setRouterState(newState));
  }, []);

  // Navigation handlers
  const handleAudioConfirm = () => {
    send(playSE(SE.DECISION_BUTTON));
    navigateWithFade({ page: 'title' });
  };

  const handleStartNewGame = () => {
    // Stop title BGM before starting game
    send(playSE(SE.DECISION_BUTTON));
    send(removeChannel('title-bgm'));
    send(sequence(buildConfigMessages(config)));
    navigateWithFade({ page: 'game' });
  };

  const handleContinue = () => {
    send(playSE(SE.DECISION_BUTTON));
    setRouterState({ page: 'load' });
  };

  const handleOpenSave = () => {
    send(playSE(SE.DECISION_BUTTON));
    setRouterState({ page: 'save' });
  };

  const handleLoadGame = () => {
    // Stop title BGM before loading game
    send(playSE(SE.DECISION_BUTTON));
    send(removeChannel('title-bgm'));
    setRouterState({ page: 'game' });
  };

  const handleBackToTitle = () => {
    send(playSE(SE.CANCEL_BUTTON));
    setRouterState({ page: 'title' });
  };

  const handleGameEndToTitle = () => {
    navigateWithFade({ page: 'title' });
  };

  const handleBackToGame = () => {
    send(playSE(SE.CANCEL_BUTTON));
    setRouterState({ page: 'game' });
  };

  const handleOpenConfigFromTitle = () => {
    send(playSE(SE.DECISION_BUTTON));
    setRouterState({ page: 'config', from: 'title' });
  };

  const handleOpenConfig = () => {
    send(playSE(SE.DECISION_BUTTON));
    setRouterState({ page: 'config', from: 'game' });
  };

  // Render page content based on router state
  const renderPage = () => {
    switch (routerState.page) {
      case 'audio-confirm':
        return <AudioConfirmPage onConfirm={handleAudioConfirm} />;

      case 'title':
        return (
          <TitlePage
            onStartNewGame={handleStartNewGame}
            onContinue={handleContinue}
            onOpenConfig={handleOpenConfigFromTitle}
          />
        );

      case 'game':
        return (
          <GamePage
            onOpenSave={handleOpenSave}
            onOpenConfig={handleOpenConfig}
            onGameEnd={handleGameEndToTitle}
          />
        );

      case 'save':
        return <SavePage onBack={handleBackToGame} />;

      case 'load':
        return <LoadPage onLoad={handleLoadGame} onBack={handleBackToTitle} />;

      case 'config':
        return (
          <ConfigPage
            onBack={
              routerState.from === 'title'
                ? handleBackToTitle
                : handleBackToGame
            }
          />
        );

      default:
        return <AudioConfirmPage onConfirm={handleAudioConfirm} />;
    }
  };

  return (
    <>
      {renderPage()}
      <FadeTransition
        isActive={isFading}
        fadeOutDuration={1000}
        fadeInDuration={1000}
        onFadeOutComplete={() => {
          pendingNavigation?.();
        }}
        onTransitionComplete={() => {
          setIsFading(false);
          setPendingNavigation(null);
        }}
      />
    </>
  );
};
