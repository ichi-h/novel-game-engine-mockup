import type { ButtonWidget, NovelMessage } from 'engine';

interface Props {
  widget: ButtonWidget;
  send: (msg: NovelMessage) => void;
}

export const Button = ({ widget, send }: Props) => {
  const handleClick = () => {
    send(widget.onClick as NovelMessage);
  };

  return (
    <button
      id={widget.id}
      className={widget.style}
      onClick={handleClick}
      type="button"
    >
      {widget.label}
    </button>
  );
};
