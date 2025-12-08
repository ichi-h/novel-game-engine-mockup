import type { ImageWidget } from '@ichi-h/tsuzuri-core';

interface Props {
  widget: ImageWidget;
}
export const Image = ({ widget }: Props) => {
  return (
    <img
      id={widget.id}
      className={widget.className}
      src={widget.src}
      alt={widget.id}
    />
  );
};
