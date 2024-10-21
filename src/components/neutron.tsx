"use client";

import { useEffect, useState } from "react";

export function Neutron({
  currentCoords,
  setCoords,
  kill,
}: {
  currentCoords: { x: number; y: number };
  setCoords: (coords: { x: number; y: number }) => void;
  kill: () => void;
}) {
  const [angle] = useState(Math.random() * 360);
  const speed = 5;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { innerWidth, innerHeight } = window;

    const interval = setInterval(() => {
      setCoords(
        (() => {
          const newX =
            currentCoords.x + Math.cos((angle * Math.PI) / 180) * speed;
          const newY =
            currentCoords.y + Math.sin((angle * Math.PI) / 180) * speed;

          const distanceX = Math.abs(newX - innerWidth / 2);
          const distanceY = Math.abs(newY - innerHeight / 2);

          if (distanceX > 800 || distanceY > 500) {
            kill();
          }

          return { x: newX, y: newY };
        })()
      );
    }, 30);

    return () => clearInterval(interval);
  }, [currentCoords.x, currentCoords.y, angle, speed, kill, setCoords]);

  return (
    <div
      className="aspect-square rounded-full bg-slate-700 size-3 p-1 absolute"
      style={{
        top: currentCoords.y,
        left: currentCoords.x,
      }}
    >
      <div className="aspect-square rounded-full bg-white" />
    </div>
  );
}
