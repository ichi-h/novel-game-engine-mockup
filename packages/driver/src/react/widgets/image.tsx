import type { ImageWidget } from 'engine';

interface Props {
  widget: ImageWidget;
}
export const Image = ({ widget }: Props) => {
  return (
    <img
      id={widget.id}
      className={widget.style}
      src={widget.src}
      alt={widget.id}
    />
  );
};
