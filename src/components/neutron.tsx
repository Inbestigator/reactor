"use client";

import { useEffect } from "react";

export function Neutron({
  startCoords,
  angle,
  kill,
  type,
}: {
  startCoords: { x: number; y: number };
  angle: number;
  kill: () => void;
  type: "fast" | "thermal";
}) {
  const distance = 5000;

  const translateX = distance * Math.cos(angle);
  const translateY = distance * Math.sin(angle);

  useEffect(() => {
    const timeout = setTimeout(() => {
      kill();
    }, 5000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="aspect-square rounded-full bg-slate-700 size-3 p-[0.16rem] absolute animate-translate"
      style={
        {
          top: startCoords.y,
          left: startCoords.x,
          "--translateX": `${translateX}px`,
          "--translateY": `${translateY}px`,
        } as React.CSSProperties
      }
    >
      {type === "fast" && (
        <div className="aspect-square rounded-full bg-white" />
      )}
    </div>
  );
}
