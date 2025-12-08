import type { LayoutWidget, NovelMessage, NovelModel } from 'engine';
import { NovelWidgetDriver } from '../novel-widget-driver';

interface Props {
  widget: LayoutWidget;
  model: NovelModel;
  send: (msg: NovelMessage) => void;
}

export const Layout = ({ widget, model, send }: Props) => {
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
