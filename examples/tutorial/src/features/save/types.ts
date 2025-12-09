export const TOTAL_SLOTS = 6;

export const createSlotKey = (slotId: number): string => `save-slot-${slotId}`;

export interface SaveSlotInfo {
  slotId: number;
  isEmpty: boolean;
  savedAt?: number;
}
