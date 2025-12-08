import type { NovelMessage } from 'engine';
import { addImage, addText, clearTextBox as clearTextBoxMsg } from 'engine';

// Widget IDs
export const TEXTBOX_ID = 'main-textbox';
export const CHARACTER_LAYOUT_ID = 'character-display';
export const BG_LAYER_ID = 'background-content-layer';

// Common styles
export const COMMON_STYLES = {
  nameText: 'font-bold text-4xl mb-4 drop-shadow-md',
  dialogText: 'text-gray-800 text-3xl leading-relaxed',
  characterImage: 'w-128 h-128 drop-shadow-2xl select-none',
} as const;

// Character colors
export const CHARACTER_COLORS = {
  bun: 'text-pink-500',
  react: 'text-cyan-500',
  player: 'text-purple-600',
} as const;

/**
 * Clear the text box
 */
export const clearTextBox = (): NovelMessage => clearTextBoxMsg(TEXTBOX_ID);

/**
 * Show character name
 */
export const showCharacterName = (name: string, color: string): NovelMessage =>
  addText({
    textBoxId: TEXTBOX_ID,
    content: name,
    className: `${color} ${COMMON_STYLES.nameText}`,
    speed: 100,
  });

/**
 * Show dialog text
 */
export const showDialog = (text: string): NovelMessage =>
  addText({
    textBoxId: TEXTBOX_ID,
    content: text,
    className: COMMON_STYLES.dialogText,
  });

/**
 * Show narration (without character name)
 */
export const showNarration = (text: string): NovelMessage[] => [
  clearTextBox(),
  showDialog(text),
];

/**
 * Show character dialog (name + text)
 */
export const showCharacterDialog = (
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacterName(name, color),
  showDialog(text),
];

/**
 * Show character image
 */
export const showCharacter = (id: string, src: string): NovelMessage =>
  addImage({
    layoutId: CHARACTER_LAYOUT_ID,
    src,
    id,
    className: COMMON_STYLES.characterImage,
  });

/**
 * Show character intro scene (image + name + text)
 */
export const introduceCharacter = (
  id: string,
  src: string,
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacter(id, src),
  showCharacterName(name, color),
  showDialog(text),
];

/**
 * Change background image
 */
export const changeBackground = (id: string, src: string): NovelMessage =>
  addImage({
    layoutId: BG_LAYER_ID,
    src,
    id,
    className: 'absolute inset-0 w-full h-full object-cover animate-fade-in',
  });
