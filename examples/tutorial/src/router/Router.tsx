import { removeChannel, sequence } from '@ichi-h/tsuzuri-core';
import { useState } from 'react';
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

  // Navigation handlers
  const handleAudioConfirm = () => {
    setRouterState({ page: 'title' });
  };

  const handleStartNewGame = () => {
    // Stop title BGM before starting game
    send(removeChannel('title-bgm'));
    send(sequence(buildConfigMessages(config)));
    setRouterState({ page: 'game' });
  };

  const handleContinue = () => {
    setRouterState({ page: 'load' });
  };

  const handleOpenSave = () => {
    setRouterState({ page: 'save' });
  };

  const handleLoadGame = () => {
    // Stop title BGM before loading game
    send(removeChannel('title-bgm'));
    setRouterState({ page: 'game' });
  };

  const handleBackToTitle = () => {
    setRouterState({ page: 'title' });
  };

  const handleBackToGame = () => {
    setRouterState({ page: 'game' });
  };

  const handleOpenConfigFromTitle = () => {
    setRouterState({ page: 'config', from: 'title' });
  };

  const handleOpenConfig = () => {
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
            toTitle={handleBackToTitle}
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

  return <>{renderPage()}</>;
};
