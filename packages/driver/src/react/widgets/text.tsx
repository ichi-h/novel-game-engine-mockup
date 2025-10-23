import type { TextWidget } from 'engine';

interface Props {
  widget: TextWidget;
}

export const Text = ({ widget }: Props) => {
  return (
    <p id={widget.id} className={widget.style}>
      {widget.content}
    </p>
  );
};
