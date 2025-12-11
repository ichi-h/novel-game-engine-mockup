import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AUDIO_BUS_IDS } from '../constants/audio';
import { getModel, send, subscribe } from '../features/game/engine';

interface BacklogPageProps {
  onBack: () => void;
}

interface DialogueEntry {
  character: 'zundamon' | 'metan' | 'narrator';
  text: string;
  voiceSrc?: string;
}

const BACKLOG_VOICE_CHANNEL = 'backlog-voice-playback';

/**
 * Extract dialogue entries from history.Next messages
 */
const extractDialogues = (
  history: NovelMessage[],
  limit: number = 50,
): DialogueEntry[] => {
  const dialogues: DialogueEntry[] = [];

  // Helper function to recursively flatten nested Sequence messages
  const flattenMessages = (messages: NovelMessage[]): NovelMessage[] => {
    const flattened: NovelMessage[] = [];
    for (const msg of messages) {
      if (msg.type === 'Sequence') {
        // Recursively flatten nested sequences
        flattened.push(...flattenMessages(msg.messages));
      } else {
        flattened.push(msg);
      }
    }
    return flattened;
  };

  // Helper function to process a list of messages
  const processMessages = (messages: NovelMessage[]) => {
    let currentText = '';
    let currentVoiceSrc: string | undefined;
    let currentCharacter: 'zundamon' | 'metan' | 'narrator' = 'narrator';

    // First flatten all nested sequences
    const flatMessages = flattenMessages(messages);

    for (const msg of flatMessages) {
      if (msg.type === 'AddText') {
        // Check if this is a character name text (has id like "character-name-ずんだもん")
        if (msg.id?.startsWith('character-name-')) {
          // Extract character name from id
          const namePart = msg.id.replace('character-name-', '');
          if (namePart.includes('ずんだもん')) {
            currentCharacter = 'zundamon';
          } else if (
            namePart.includes('めたん') ||
            namePart.includes('四国めたん')
          ) {
            currentCharacter = 'metan';
          }
        } else if (!msg.id) {
          // This is the actual dialogue text (no id)
          currentText = msg.content;
        }
      } else if (msg.type === 'AddTrack') {
        // Only track voice audio (not BGM or SE)
        if (msg.busTrackId === 'voice-bus') {
          currentVoiceSrc = msg.src;
          // Determine character from track ID
          if (msg.id?.includes('zundamon')) {
            currentCharacter = 'zundamon';
          } else if (msg.id?.includes('metan')) {
            currentCharacter = 'metan';
          }
        }
      } else if (msg.type === 'PlayChannel') {
        // Determine character from channel ID
        if (msg.channelId?.includes('zundamon')) {
          currentCharacter = 'zundamon';
        } else if (msg.channelId?.includes('metan')) {
          currentCharacter = 'metan';
        }
      }
    }

    return { currentText, currentVoiceSrc, currentCharacter };
  };

  // Process from oldest to newest (reverse order)
  for (let i = history.length - 1; i >= 0 && dialogues.length < limit; i--) {
    const msg = history[i];

    if (msg && msg.type === 'Next') {
      const innerMsg = msg.message;

      // Handle Sequence messages
      if (innerMsg.type === 'Sequence') {
        const { currentText, currentVoiceSrc, currentCharacter } =
          processMessages(innerMsg.messages);

        // If we found text, add it as a dialogue entry (check for duplicates)
        if (currentText) {
          const lastDialogue = dialogues[0];
          const isDuplicate =
            lastDialogue &&
            lastDialogue.text === currentText &&
            lastDialogue.character === currentCharacter;

          if (!isDuplicate) {
            dialogues.unshift({
              character: currentCharacter,
              text: currentText,
              voiceSrc: currentVoiceSrc,
            });
          }
        }
      } else if (innerMsg.type === 'AddText') {
        // Handle direct AddText messages (check for duplicates)
        const lastDialogue = dialogues[0];
        const isDuplicate =
          lastDialogue &&
          lastDialogue.text === innerMsg.content &&
          lastDialogue.character === 'narrator';

        if (!isDuplicate) {
          dialogues.unshift({
            character: 'narrator',
            text: innerMsg.content,
            voiceSrc: undefined,
          });
        }
      }
    }
  }

  return dialogues.slice(0, limit);
};

/**
 * Backlog page component showing dialogue history
 */
export const BacklogPage = ({ onBack }: BacklogPageProps) => {
  const model = useSyncExternalStore(subscribe, getModel);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract dialogues from history
  const dialogues = extractDialogues(model.history.Next, 50);

  // Scroll to bottom on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const playVoice = (voiceSrc: string, character: 'zundamon' | 'metan') => {
    // Remove the backlog voice channel first to avoid overlap
    send({
      type: 'Sequence',
      messages: [
        {
          type: 'RemoveChannel',
          channelId: BACKLOG_VOICE_CHANNEL,
        },
        {
          type: 'AddTrack',
          id: BACKLOG_VOICE_CHANNEL,
          busTrackId: AUDIO_BUS_IDS.VOICE,
          volume: character === 'zundamon' ? 1.05 : 1.0,
          src: voiceSrc,
        },
        {
          type: 'PlayChannel',
          channelId: BACKLOG_VOICE_CHANNEL,
        },
      ],
    });
  };

  const getCharacterName = (character: 'zundamon' | 'metan' | 'narrator') => {
    switch (character) {
      case 'zundamon':
        return 'ずんだもん';
      case 'metan':
        return '四国めたん';
      case 'narrator':
        return 'ナレーション';
    }
  };

  const getCharacterColor = (character: 'zundamon' | 'metan' | 'narrator') => {
    switch (character) {
      case 'zundamon':
        return 'text-green-600';
      case 'metan':
        return 'text-pink-600';
      case 'narrator':
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📜 バックログ</h1>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow hover:bg-white transition-colors text-gray-700 font-medium"
        >
          ← 戻る
        </button>
      </div>

      {/* Dialogue list */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-4">
          {dialogues.length === 0 ? (
            <div className="text-center text-gray-600">
              まだ会話履歴がありません
            </div>
          ) : (
            dialogues.map((dialogue, index) => (
              <div
                key={`${dialogue.text.slice(0, 20)}-${index}`}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4 hover:bg-white transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div
                      className={`font-bold text-lg mb-2 ${getCharacterColor(dialogue.character)}`}
                    >
                      {getCharacterName(dialogue.character)}
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap">
                      {dialogue.text}
                    </div>
                  </div>
                  {dialogue.voiceSrc && dialogue.character !== 'narrator' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          dialogue.voiceSrc &&
                          dialogue.character !== 'narrator'
                        ) {
                          playVoice(dialogue.voiceSrc, dialogue.character);
                        }
                      }}
                      className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-colors shadow-lg"
                      title="ボイス再生"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
