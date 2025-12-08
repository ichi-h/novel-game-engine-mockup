import { generateInitModel, type NovelModel } from '@ichi-h/tsuzuri-core';
import { useCallback, useState } from 'react';

import './index.css';

import { FadeTransition } from './components/FadeTransition';
import { AudioConfirmPage } from './pages/AudioConfirmPage';
import { GamePage } from './pages/GamePage';
import { LoadPage } from './pages/LoadPage';
import { SavePage } from './pages/SavePage';
import { TitlePage } from './pages/TitlePage';
import type { RouterState } from './types/router';

/**
 * Main App component with state-based routing
 */
export function App() {
  const [routerState, setRouterState] = useState<RouterState>({
    page: 'audio-confirm',
  });

  // Store the current game model when navigating to save page
  const [savedGameModel, setSavedGameModel] = useState<NovelModel | null>(null);

  // Fade transition state
  const [isFading, setIsFading] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  // Start fade transition to game page
  const navigateToGameWithFade = useCallback((model: NovelModel) => {
    setIsFading(true);
    setPendingNavigation(() => () => {
      setRouterState({ page: 'game', initialModel: model });
    });
  }, []);

  // Handle fade out complete - switch page content
  const handleFadeOutComplete = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
    }
  }, [pendingNavigation]);

  // Handle transition complete - cleanup
  const handleTransitionComplete = useCallback(() => {
    setIsFading(false);
    setPendingNavigation(null);
  }, []);

  // Navigation handlers
  const handleAudioConfirm = () => {
    setRouterState({ page: 'title' });
  };

  const handleStartNewGame = () => {
    navigateToGameWithFade(generateInitModel());
  };

  const handleContinue = () => {
    setRouterState({ page: 'load' });
  };

  const handleOpenSave = (model: NovelModel) => {
    setSavedGameModel(model);
    setRouterState({ page: 'save', gameModel: model });
  };

  const handleLoadGame = (model: NovelModel) => {
    navigateToGameWithFade(model);
  };

  const handleBackToTitle = () => {
    setRouterState({ page: 'title' });
  };

  const handleBackToGame = () => {
    if (savedGameModel) {
      setRouterState({ page: 'game', initialModel: savedGameModel });
    }
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
            initialModel={routerState.initialModel}
            onOpenSave={handleOpenSave}
            toTitle={handleBackToTitle}
          />
        );

      case 'save':
        return (
          <SavePage
            gameModel={routerState.gameModel}
            onBack={handleBackToGame}
          />
        );

      case 'load':
        return <LoadPage onLoad={handleLoadGame} onBack={handleBackToTitle} />;

      default:
        return <AudioConfirmPage onConfirm={handleAudioConfirm} />;
    }
  };

  return (
    <>
      {renderPage()}
      <FadeTransition
        isActive={isFading}
        fadeOutDuration={400}
        fadeInDuration={400}
        onFadeOutComplete={handleFadeOutComplete}
        onTransitionComplete={handleTransitionComplete}
      />
    </>
  );
}

export default App;
