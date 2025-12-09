import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddImageMessage extends BaseMessage {
  type: 'AddImage';
  id?: string;
  layoutId: string;
  src: string;
  className?: string;
}

export const addImage = ({
  layoutId,
  src,
  id,
  className,
}: Omit<AddImageMessage, 'type'>): AddImageMessage => {
  return {
    type: 'AddImage',
    layoutId,
    src,
    ...(id !== undefined ? { id } : {}),
    ...(className !== undefined ? { className } : {}),
  };
};

export const handleAddImage = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddImageMessage,
): NovelModel<CustomState> => {
  const newImage = w.img({
    src: msg.src,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.className !== undefined && { className: msg.className }),
  });
  return {
    ...model,
    ui: addWidget(model.ui, newImage, msg.layoutId),
  };
};
