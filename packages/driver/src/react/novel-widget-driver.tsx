import type { NovelWidget } from 'engine';
import type { ReactComponentDriver } from './type';
import { CustomLayout, Image, Layout, Text, TextBox } from './widgets';

interface Props {
  widgets: readonly NovelWidget<ReactComponentDriver>[];
}

export const NovelWidgetDriver = ({ widgets }: Props) => {
  return (
    <>
      {widgets.map((widget, i) => {
        switch (widget.type) {
          case 'CustomLayout':
            return (
              <CustomLayout
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
              />
            );
          case 'Image':
            return (
              <Image key={`${widget.type}_${widget.id}_${i}`} widget={widget} />
            );
          case 'Layout':
            return (
              <Layout
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
              />
            );
          case 'TextBox':
            return (
              <TextBox
                key={`${widget.type}_${widget.id}_${i}`}
                widget={widget}
              />
            );
          case 'Text':
            return (
              <Text key={`${widget.type}_${widget.id}_${i}`} widget={widget} />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
