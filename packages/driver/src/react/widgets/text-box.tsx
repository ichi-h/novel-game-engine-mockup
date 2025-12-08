import type {
  NovelMessage,
  NovelModel,
  TextBoxWidget,
} from '@ichi-h/tsuzuri-core';
import { NovelWidgetDriver } from '../novel-widget-driver';

interface Props {
  widget: TextBoxWidget;
  model: NovelModel;
  send: (msg: NovelMessage) => void;
}

export const TextBox = ({ widget, model, send }: Props) => {
  return (
    <div id={widget.id} className={widget.className}>
      {widget.children.map((child, i) => (
        <NovelWidgetDriver
          key={`${child.type}_${child.id}_${i}`}
          widgets={[child]}
          model={model}
          send={send}
        />
      ))}
    </div>
  );
};
