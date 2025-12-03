import type { NovelMessage, NovelModel, NovelWidget } from 'engine';
import { Button, Image, Layout, Text, TextBox } from './widgets';

interface Props {
  widgets: NovelWidget[];
  model: NovelModel;
  send: (msg: NovelMessage) => void;
}

export const NovelWidgetDriver = ({ widgets, model, send }: Props) => {
  return (
    <>
      {widgets.map((widget, i) => {
        switch (widget.type) {
          case 'Image':
            return (
              <Image key={`${widget.type}_${widget.id}_${i}`} widget={widget} />
            );
          case 'Layout':
            return (
              <Layout
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                model={model}
                send={send}
              />
            );
          case 'TextBox':
            return (
              <TextBox
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                model={model}
                send={send}
              />
            );
          case 'Text':
            return (
              <Text
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                isAnimating={model.animationTickets.some(
                  (ticket) => ticket.id === widget.id,
                )}
                model={model}
              />
            );
          case 'Button':
            return (
              <Button
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                send={send}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
