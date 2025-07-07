import gsap from 'gsap';

export const animateDialogIn = (overlay: HTMLElement, dialog: HTMLElement) => {
  // Reset initial styles
  gsap.set(overlay, { opacity: 0 });
  gsap.set(dialog, { y: 20, opacity: 0 });

  // Create and return the animation timeline
  return gsap
    .timeline()
    .to(overlay, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out',
    })
    .to(
      dialog,
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.2)',
      },
      '-=0.1'
    );
};

export const animateDialogOut = (overlay: HTMLElement, dialog: HTMLElement) => {
  // Create and return the animation timeline
  return gsap
    .timeline()
    .to(dialog, {
      y: -20,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    })
    .to(
      overlay,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
      },
      '-=0.1'
    );
};
