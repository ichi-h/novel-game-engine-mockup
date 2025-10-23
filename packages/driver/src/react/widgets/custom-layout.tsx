import type { CustomLayoutWidget } from 'engine';
import { NovelWidgetDriver } from '../novel-widget-driver';
import type { ReactComponentDriver } from '../type';

interface Props {
  widget: CustomLayoutWidget<ReactComponentDriver>;
}

export const CustomLayout = ({ widget }: Props) => {
  return (
    <widget.component>
      {widget.children.map((child, i) => (
        <NovelWidgetDriver
          key={`${child.type}_${child.id}_${i}`}
          widgets={[child]}
        />
      ))}
    </widget.component>
  );
};
