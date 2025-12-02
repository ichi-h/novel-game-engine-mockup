import type { SaveSlotInfo } from '../types/router';

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
            : 'border-pink-300 bg-white/90 hover:border-pink-500 hover:shadow-lg'
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <title>削除</title>
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
