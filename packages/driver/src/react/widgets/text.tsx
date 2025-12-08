import {
  calcTextAnimationDuration,
  type NovelModel,
  type TextWidget,
} from 'engine';
import { type CSSProperties, useEffect, useState } from 'react';

const generateCharStyle = (
  isAnimating: boolean,
  isRendered: boolean,
  delayMs: number,
): CSSProperties => {
  if (!isAnimating) return {};

  if (!isRendered)
    return {
      opacity: 0,
    };

  return {
    opacity: 1,
    transitionDuration: '50ms',
    transitionDelay: `${delayMs}ms`,
  };
};

interface CharProps {
  char: string;
  isAnimating: boolean;
  isRendered: boolean;
  delay: number;
}

const Char = ({ char, isAnimating, isRendered, delay }: CharProps) => {
  return (
    <span style={generateCharStyle(isAnimating, isRendered, delay)}>
      {char}
    </span>
  );
};

interface Props {
  widget: TextWidget;
  isAnimating: boolean;
  model: NovelModel;
}

export const Text = ({ widget, isAnimating, model }: Props) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsRendered(true);
    });
  }, []);

  if (!isAnimating) {
    return (
      <p id={widget.id} className={widget.style}>
        {widget.content}
      </p>
    );
  }

  const chars = widget.content.split('');

  return (
    <p id={widget.id} className={widget.style}>
      {chars.map((char, index) => (
        <Char
          key={`${widget.id}_char_${index}`}
          char={char}
          isAnimating={isAnimating}
          isRendered={isRendered}
          delay={calcTextAnimationDuration(
            widget.speed ?? model.config.textAnimationSpeed,
            index,
          )}
        />
      ))}
    </p>
  );
};
