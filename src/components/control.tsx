"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { type Neutron } from "@/app/page";
import { Moderator } from "./moderator";

export function Control({
  neutrons,
  setNeutrons,
  raised,
}: {
  neutrons: Record<string, Neutron>;
  setNeutrons: Dispatch<SetStateAction<Record<string, Neutron>>>;
  raised: number;
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
            setNeutrons((prev) => {
              const newNeutrons = { ...prev };
              delete newNeutrons[k];
              return newNeutrons;
            });
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
      className="bg-slate-700 w-2.5 transition-[height] duration-[5000ms] ease-in-out relative"
      style={{ height: 105 - raised + "%" }}
    >
      <div className="bg-slate-700 w-0.5 h-40 absolute top-full left-1/2 -translate-x-1/2" />
      <div className="absolute top-full mt-40 h-96 left-1/2 -translate-x-1/2">
        <Moderator neutrons={neutrons} setNeutrons={setNeutrons} />
      </div>
    </div>
  );
}
