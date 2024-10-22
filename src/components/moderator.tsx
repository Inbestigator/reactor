"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { type Neutron } from "@/app/page";

export function Moderator({
  neutrons,
  setNeutrons,
}: {
  neutrons: Record<string, Neutron>;
  setNeutrons: Dispatch<SetStateAction<Record<string, Neutron>>>;
}) {
  const modRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (modRef.current) {
        const rect = modRef.current.getBoundingClientRect();

        Object.entries(neutrons).forEach(([k, neutron]) => {
          const pos = calculateNeutronPosition();

          function calculateNeutronPosition() {
            const timeElapsed = (Date.now() - neutron.createdAt) / 1000;
            const velocity = 5000 / (neutron.type === "fast" ? 20 : 40);
            const distanceMoved = velocity * timeElapsed;
            const posX =
              Math.cos(neutron.angle) * distanceMoved + neutron.startCoords.x;
            const posY =
              Math.sin(neutron.angle) * distanceMoved + neutron.startCoords.y;
            return { x: posX, y: posY };
          }

          const neutronRect = {
            left: pos.x,
            top: pos.y,
            right: pos.x + 12,
            bottom: pos.y + 12,
          };

          const amIHit =
            neutronRect.left < rect.right &&
            neutronRect.right > rect.left &&
            neutronRect.top < rect.bottom &&
            neutronRect.bottom > rect.top;

          if (amIHit) {
            switch (neutron.type) {
              case "fast": {
                setNeutrons((prev) => {
                  const newNeutrons = { ...prev };
                  delete newNeutrons[k];
                  newNeutrons[crypto.randomUUID()] = {
                    startCoords: pos,
                    angle: Math.PI - neutron.angle,
                    createdAt: Date.now(),
                    type: "thermal",
                  };
                  return newNeutrons;
                });
                break;
              }
              case "thermal": {
                setNeutrons((prev) => {
                  const newNeutrons = { ...prev };
                  delete newNeutrons[k];
                  return newNeutrons;
                });
                break;
              }
            }
          }

          return amIHit;
        });
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [neutrons, setNeutrons]);

  return (
    <div
      ref={modRef}
      className="bg-white border-2 border-slate-700 w-2.5 h-full"
    />
  );
}
