import React, { useEffect, useState } from "react";

export default function TypingText({ text, speed = 30, onDone, onStep }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let current = 0;
    let cancelled = false;

    function type() {
      if (cancelled) return;
      setDisplayed(text.slice(0, current + 1));
      if (onStep) onStep();
      if (current < text.length - 1) {
        current++;
        setTimeout(type, speed);
      } else if (onDone) {
        onDone();
      }
    }
    type();
    return () => {
      cancelled = true;
    };
  }, [text, speed, onDone, onStep]);
  return <span>{displayed}</span>;
}