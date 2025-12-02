import { generateInitModel, type NovelModel } from 'engine';
import { useState } from 'react';

import './index.css';

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

  // Navigation handlers
  const handleAudioConfirm = () => {
    setRouterState({ page: 'title' });
  };

  const handleStartNewGame = () => {
    setRouterState({ page: 'game', initialModel: generateInitModel() });
  };

  const handleContinue = () => {
    setRouterState({ page: 'load' });
  };

  const handleOpenSave = (model: NovelModel) => {
    setSavedGameModel(model);
    setRouterState({ page: 'save', gameModel: model });
  };

  const handleLoadGame = (model: NovelModel) => {
    setRouterState({ page: 'game', initialModel: model });
  };

  const handleBackToTitle = () => {
    setRouterState({ page: 'title' });
  };

  const handleBackToGame = () => {
    if (savedGameModel) {
      setRouterState({ page: 'game', initialModel: savedGameModel });
    }
  };

  // Render current page based on router state
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
        <SavePage gameModel={routerState.gameModel} onBack={handleBackToGame} />
      );

    case 'load':
      return <LoadPage onLoad={handleLoadGame} onBack={handleBackToTitle} />;

    default:
      return <AudioConfirmPage onConfirm={handleAudioConfirm} />;
  }
}

export default App;
