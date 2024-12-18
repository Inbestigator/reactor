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
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="aspect-square rounded-full bg-slate-700 size-3 p-0.5 absolute animate-neutron"
      style={
        {
          top: startCoords.y,
          left: startCoords.x,
          "--translateX": `${translateX}px`,
          "--translateY": `${translateY}px`,
          "--speed": (type === "fast" ? 20 : 40) + "s",
        } as React.CSSProperties
      }
    >
      {type === "fast" && (
        <div className="aspect-square rounded-full bg-white" />
      )}
    </div>
  );
}
