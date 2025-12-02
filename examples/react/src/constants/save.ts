/**
 * Total number of save slots
 */
export const TOTAL_SLOTS = 10;

/**
 * Prefix for save slot keys in IndexedDB
 */
export const SLOT_KEY_PREFIX = 'novel-save-slot-';

/**
 * Create a slot key for IndexedDB
 */
export const createSlotKey = (slotId: number): string =>
  `${SLOT_KEY_PREFIX}${slotId}`;
