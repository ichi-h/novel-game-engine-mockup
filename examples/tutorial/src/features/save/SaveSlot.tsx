import type { SaveSlotInfo } from './types';

interface SaveSlotProps {
  slot: SaveSlotInfo;
  mode: 'save' | 'load';
  onSelect: (slotId: number) => void;
  onDelete?: (slotId: number) => void;
}

/**
 * Format timestamp to readable date string
 */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Save slot component for save/load screens
 */
export const SaveSlot = ({ slot, mode, onSelect, onDelete }: SaveSlotProps) => {
  const handleSelect = () => {
    if (mode === 'load' && slot.isEmpty) {
      return;
    }
    onSelect(slot.slotId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !slot.isEmpty) {
      onDelete(slot.slotId);
    }
  };

  const isDisabled = mode === 'load' && slot.isEmpty;

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${
          isDisabled
            ? 'border-gray-300 bg-gray-100 opacity-50'
            : 'border-green-300 bg-white/90 hover:border-green-500 hover:shadow-lg'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex-1 text-left cursor-pointer disabled:cursor-not-allowed"
          onClick={handleSelect}
          disabled={isDisabled}
          aria-label={`スロット ${slot.slotId + 1}${slot.isEmpty ? ' (空)' : ''}`}
        >
          <div className="text-lg font-bold text-gray-700">
            スロット {slot.slotId + 1}
          </div>
          {slot.isEmpty ? (
            <div className="text-sm text-gray-400 mt-1">-- 空きスロット --</div>
          ) : (
            <div className="text-sm text-gray-500 mt-1">
              {slot.savedAt ? formatDate(slot.savedAt) : '保存済み'}
            </div>
          )}
        </button>

        {!slot.isEmpty && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`スロット ${slot.slotId + 1} を削除`}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};
