import { send } from '../features/game/engine';
import { SaveSlot } from '../features/save/SaveSlot';
import { useSaveSlots } from '../features/save/useSaveSlots';

interface LoadPageProps {
  onLoad: () => void;
  onBack: () => void;
}

/**
 * Load page component
 */
export const LoadPage = ({ onLoad, onBack }: LoadPageProps) => {
  const { slots, isLoading, loadFromSlot, deleteSlot } = useSaveSlots();

  const handleLoad = async (slotId: number) => {
    try {
      const model = await loadFromSlot(slotId);
      if (model) {
        send({ type: 'PutModel', model });
        onLoad();
      } else {
        alert('データの読み込みに失敗しました。');
      }
    } catch (error) {
      console.error('Load failed:', error);
      alert('ロードに失敗しました。');
    }
  };

  const handleDelete = async (slotId: number) => {
    const confirmed = window.confirm(
      `スロット ${slotId + 1} のデータを削除しますか?`,
    );
    if (!confirmed) return;

    try {
      await deleteSlot(slotId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('削除に失敗しました。');
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📂 ロード</h1>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow hover:bg-white transition-colors text-gray-700 font-medium"
        >
          ← 戻る
        </button>
      </div>

      {/* Slot grid */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="text-center text-gray-600">読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {slots.map((slot) => (
              <SaveSlot
                key={slot.slotId}
                slot={slot}
                mode="load"
                onSelect={handleLoad}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
