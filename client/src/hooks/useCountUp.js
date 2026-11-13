import { useState, useEffect } from 'react';

/**
 * Custom hook to count up smoothly to a target number.
 * Uses requestAnimationFrame without external dependencies.
 */
export const useCountUp = (target, duration = 400, start = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    const numericTarget = typeof target === 'number' ? target : parseFloat(target) || 0;
    if (numericTarget <= 0) {
      setCount(0);
      return;
    }

    const isDecimal = numericTarget % 1 !== 0;
    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out quad timing
      const easeOut = 1 - (1 - progress) * (1 - progress);
      const current = easeOut * numericTarget;

      if (isDecimal) {
        setCount(Math.round(current * 10) / 10);
      } else {
        setCount(Math.round(current));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration, start]);

  return count;
};

export default useCountUp;

