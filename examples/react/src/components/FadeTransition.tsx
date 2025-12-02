import { useEffect, useState } from 'react';

type TransitionPhase = 'idle' | 'fading-out' | 'fading-in';

interface FadeTransitionProps {
  /** Whether the transition should start */
  isActive: boolean;
  /** Duration of fade out in milliseconds */
  fadeOutDuration?: number;
  /** Duration of fade in in milliseconds */
  fadeInDuration?: number;
  /** Callback when fade out is complete (switch content here) */
  onFadeOutComplete: () => void;
  /** Callback when entire transition is complete */
  onTransitionComplete?: () => void;
}

/**
 * Fade transition overlay component.
 * Renders a black overlay that fades in (screen goes dark),
 * then fades out (screen becomes visible again).
 */
export const FadeTransition = ({
  isActive,
  fadeOutDuration = 500,
  fadeInDuration = 500,
  onFadeOutComplete,
  onTransitionComplete,
}: FadeTransitionProps) => {
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Start fading out (overlay becomes visible = screen goes dark)
    setPhase('fading-out');

    const fadeOutTimer = setTimeout(() => {
      onFadeOutComplete();
      // Start fading in (overlay becomes invisible = screen becomes visible)
      setPhase('fading-in');
    }, fadeOutDuration);

    const fadeInTimer = setTimeout(() => {
      setPhase('idle');
      onTransitionComplete?.();
    }, fadeOutDuration + fadeInDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(fadeInTimer);
    };
  }, [
    isActive,
    fadeOutDuration,
    fadeInDuration,
    onFadeOutComplete,
    onTransitionComplete,
  ]);

  if (phase === 'idle') {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black pointer-events-none ${
        phase === 'fading-out' ? 'animate-fade-overlay-in' : 'animate-fade-overlay-out'
      }`}
      style={{
        animationDuration:
          phase === 'fading-out' ? `${fadeOutDuration}ms` : `${fadeInDuration}ms`,
      }}
      aria-hidden="true"
    />
  );
};
