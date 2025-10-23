import type { LayoutWidget } from 'engine';
import { NovelWidgetDriver } from '../novel-widget-driver';
import type { ReactComponentDriver } from '../type';

interface Props {
  widget: LayoutWidget<ReactComponentDriver>;
}

export const Layout = ({ widget }: Props) => {
  return (
    <div id={widget.id} className={widget.style}>
      {widget.children.map((child, i) => (
        <NovelWidgetDriver
          key={`${child.type}_${child.id}_${i}`}
          widgets={[child]}
        />
      ))}
    </div>
  );
};
