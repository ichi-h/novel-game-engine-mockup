import { useEffect, useState } from 'react';
import { BGM, SE, VOICE_METAN, VOICE_ZUNDAMON } from '@/constants/audio';
import { BACKGROUNDS, CHARACTER_IMAGES, IMAGES } from '@/features/game/helpers';

interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  isComplete: boolean;
  errors: string[];
}

/**
 * Preload an image by creating an Image object
 */
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Preload an audio file by creating an Audio element
 */
const preloadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'auto';

    const handleCanPlay = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load audio: ${src}`));
    };

    const cleanup = () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.src = src;
    audio.load();
  });
};

/**
 * Collect all asset URLs from constants
 */
const getAllAssetUrls = (): { images: string[]; audio: string[] } => {
  const images: string[] = [];
  const audio: string[] = [];

  // Collect BGM
  Object.values(BGM).forEach((src) => {
    audio.push(src);
  });

  // Collect SE
  Object.values(SE).forEach((src) => {
    audio.push(src);
  });

  // Collect Voice - Zundamon
  Object.values(VOICE_ZUNDAMON).forEach((src) => {
    audio.push(src);
  });

  // Collect Voice - Metan
  Object.values(VOICE_METAN).forEach((src) => {
    audio.push(src);
  });

  // Collect character images
  Object.values(CHARACTER_IMAGES.zundamon).forEach((src) => {
    images.push(src);
  });
  Object.values(CHARACTER_IMAGES.metan).forEach((src) => {
    images.push(src);
  });

  // Collect backgrounds
  Object.values(BACKGROUNDS).forEach((src) => {
    images.push(src);
  });

  // Collect other images
  Object.values(IMAGES).forEach((src) => {
    images.push(src);
  });

  return { images, audio };
};

/**
 * Hook to preload all game assets
 * Returns progress information and completion status
 */
export const useAssetPreloader = () => {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    isComplete: false,
    errors: [],
  });

  useEffect(() => {
    const { images, audio } = getAllAssetUrls();
    const totalAssets = images.length + audio.length;

    setProgress({
      loaded: 0,
      total: totalAssets,
      percentage: 0,
      isComplete: false,
      errors: [],
    });

    let loadedCount = 0;
    const errors: string[] = [];

    const updateProgress = () => {
      loadedCount++;
      const percentage = Math.round((loadedCount / totalAssets) * 100);

      setProgress({
        loaded: loadedCount,
        total: totalAssets,
        percentage,
        isComplete: loadedCount === totalAssets,
        errors: [...errors],
      });
    };

    // Preload all assets
    const preloadPromises = [
      ...images.map((src) =>
        preloadImage(src)
          .then(updateProgress)
          .catch((error) => {
            console.warn(error);
            errors.push(error.message);
            updateProgress();
          }),
      ),
      ...audio.map((src) =>
        preloadAudio(src)
          .then(updateProgress)
          .catch((error) => {
            console.warn(error);
            errors.push(error.message);
            updateProgress();
          }),
      ),
    ];

    // Wait for all assets to load
    Promise.all(preloadPromises).then(() => {
      console.log('All assets preloaded successfully');
      if (errors.length > 0) {
        console.warn(`${errors.length} assets failed to load:`, errors);
      }
    });
  }, []);

  return progress;
};
