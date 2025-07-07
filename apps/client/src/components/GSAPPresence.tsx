import React from 'react';
import { useGSAP } from '@gsap/react';

type Props = {
  enter?: (el: HTMLElement) => gsap.core.Tween | gsap.core.Timeline;
  exit?: (el: HTMLElement) => gsap.core.Tween | gsap.core.Timeline;
  children: React.ReactNode;
};

export const GSAPPresence = ({ children, enter, exit }: Props) => {
  const [rendered, setRendered] = React.useState(children);
  const [_, setIsExiting] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const el = containerRef.current.firstElementChild as HTMLElement;
      if (el) {
        enter?.(el);
      }
    },
    { dependencies: [rendered, enter] }
  );

  useGSAP(
    () => {
      if (children) {
        setRendered(children);
        setIsExiting(false);
      } else if (containerRef.current?.firstElementChild) {
        setIsExiting(true);
        const el = containerRef.current.firstElementChild as HTMLElement;
        const animation = exit?.(el);
        animation?.eventCallback('onComplete', () => {
          setRendered(null);
          setIsExiting(false);
        });
      }
    },
    { dependencies: [children, exit] }
  );

  return <div ref={containerRef}>{rendered}</div>;
};
