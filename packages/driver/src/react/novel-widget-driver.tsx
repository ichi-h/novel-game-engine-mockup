import type { NovelModel, NovelWidget } from 'engine';
import { Image, Layout, Text, TextBox } from './widgets';

interface Props {
  widgets: NovelWidget[];
  model: NovelModel;
}

export const NovelWidgetDriver = ({ widgets, model }: Props) => {
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
              />
            );
          case 'TextBox':
            return (
              <TextBox
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
                model={model}
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
          default:
            return null;
        }
      })}
    </>
  );
};
