import type { CustomLayoutWidget, NovelModel } from 'engine';
import { NovelWidgetDriver } from '../novel-widget-driver';
import type { ReactComponentDriver } from '../type';

interface Props {
  widget: CustomLayoutWidget<ReactComponentDriver>;
  model: NovelModel<ReactComponentDriver>;
}

export const CustomLayout = ({ widget, model }: Props) => {
  return (
    <widget.component>
      {widget.children.map((child, i) => (
        <NovelWidgetDriver
          key={`${child.type}_${child.id}_${i}`}
          widgets={[child]}
          model={model}
        />
      ))}
    </widget.component>
  );
};
