import type { NovelModel } from '@ichi-h/tsuzuri-core';
import {
  createModelPersistence,
  type ModelPersistence,
} from '@ichi-h/tsuzuri-driver';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createSlotKey, TOTAL_SLOTS } from '../constants/save';
import type { SaveSlotInfo } from '../types/router';

/**
 * Hook for managing save slots
 */
export const useSaveSlots = () => {
  const [slots, setSlots] = useState<SaveSlotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const persistence = useMemo<ModelPersistence>(
    () => createModelPersistence('novel-game-saves'),
    [],
  );

  /**
   * Refresh all slot information
   */
  const refreshSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const slotPromises = Array.from({ length: TOTAL_SLOTS }, async (_, i) => {
        const key = createSlotKey(i);
        const exists = await persistence.exists(key);

        if (exists) {
          // Load to get savedAt timestamp
          const model = await persistence.load(key);
          // We need to access the raw record for savedAt
          // For now, we'll use the current time as a placeholder
          // In a real implementation, we'd need to extend the persistence API
          return {
            slotId: i,
            isEmpty: false,
            savedAt: model ? Date.now() : undefined,
          } as SaveSlotInfo;
        }

        return {
          slotId: i,
          isEmpty: true,
        } as SaveSlotInfo;
      });

      const loadedSlots = await Promise.all(slotPromises);
      setSlots(loadedSlots);
    } catch (error) {
      console.error('Failed to refresh save slots:', error);
    } finally {
      setIsLoading(false);
    }
  }, [persistence]);

  /**
   * Save model to a specific slot
   */
  const saveToSlot = useCallback(
    async (slotId: number, model: NovelModel): Promise<void> => {
      const key = createSlotKey(slotId);
      await persistence.save(key, model);

      // Update local state
      setSlots((prev) =>
        prev.map((slot) =>
          slot.slotId === slotId
            ? { ...slot, isEmpty: false, savedAt: Date.now() }
            : slot,
        ),
      );
    },
    [persistence],
  );

  /**
   * Load model from a specific slot
   */
  const loadFromSlot = useCallback(
    async (slotId: number): Promise<NovelModel | undefined> => {
      const key = createSlotKey(slotId);
      return await persistence.load(key);
    },
    [persistence],
  );

  /**
   * Delete a save slot
   */
  const deleteSlot = useCallback(
    async (slotId: number): Promise<void> => {
      const key = createSlotKey(slotId);
      await persistence.remove(key);

      // Update local state
      setSlots((prev) =>
        prev.map((slot) =>
          slot.slotId === slotId
            ? { slotId, isEmpty: true, savedAt: undefined }
            : slot,
        ),
      );
    },
    [persistence],
  );

  // Initial load
  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  return {
    slots,
    isLoading,
    refreshSlots,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
  };
};
