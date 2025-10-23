import type { TextBoxWidget } from 'engine';
import { Text } from './text';

interface Props {
  widget: TextBoxWidget;
}

export const TextBox = ({ widget }: Props) => {
  return (
    <div id={widget.id} className={widget.style}>
      {widget.children.map((child, i) => (
        <Text key={`${widget.id}_${i}`} widget={child} />
      ))}
    </div>
  );
};
