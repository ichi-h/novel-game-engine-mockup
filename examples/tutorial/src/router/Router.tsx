import { useState } from 'react';
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
  | { page: 'config' };

export const Router = () => {
  const [routerState, setRouterState] = useState<RouterState>({
    page: 'audio-confirm',
  });

  // Navigation handlers
  const handleAudioConfirm = () => {
    setRouterState({ page: 'title' });
  };

  const handleStartNewGame = () => {
    setRouterState({ page: 'game' });
  };

  const handleContinue = () => {
    setRouterState({ page: 'load' });
  };

  const handleOpenSave = () => {
    setRouterState({ page: 'save' });
  };

  const handleLoadGame = () => {
    setRouterState({ page: 'game' });
  };

  const handleBackToTitle = () => {
    setRouterState({ page: 'title' });
  };

  const handleBackToGame = () => {
    setRouterState({ page: 'game' });
  };

  const handleOpenConfig = () => {
    setRouterState({ page: 'config' });
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
        return <ConfigPage onBack={handleBackToGame} />;

      default:
        return <AudioConfirmPage onConfirm={handleAudioConfirm} />;
    }
  };

  return <>{renderPage()}</>;
};
