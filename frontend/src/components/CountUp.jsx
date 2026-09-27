import { useEffect, useState } from "react";

export default function CountUp({ value, duration = 600 }) {
  // If value has non-digit characters like '142+', '97%', etc.
  const strVal = String(value ?? "");
  const numMatch = strVal.match(/(\d+)/);
  const targetNum = numMatch ? parseInt(numMatch[1], 10) : null;
  const prefix = numMatch ? strVal.slice(0, numMatch.index) : "";
  const suffix = numMatch ? strVal.slice(numMatch.index + numMatch[1].length) : strVal;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetNum === null || isNaN(targetNum)) {
      return;
    }

    let startTime = null;
    let animationFrameId;

    const updateCount = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutExpo easing function
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * targetNum));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(targetNum);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum, duration]);

  if (targetNum === null || isNaN(targetNum)) {
    return <span>{strVal}</span>;
  }

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
