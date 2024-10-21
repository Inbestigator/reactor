"use client";

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { type Neutron } from "@/app/page";

function blendWater(v: number) {
  const startColor = { r: 191, g: 219, b: 254 };
  const endColor = { r: 248, g: 113, b: 113 };

  if (v >= 100) {
    return "#00000000";
  }

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * (v / 100));
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * (v / 100));
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * (v / 100));

  return `rgb(${r}, ${g}, ${b})`;
}

export function Atom({
  neutrons,
  setNeutrons,
}: {
  neutrons: Record<string, Neutron>;
  setNeutrons: Dispatch<SetStateAction<Record<string, Neutron>>>;
}) {
  const [element, setElement] = useState<"U" | "?" | "Xe">("?");
  const [water, setWater] = useState(0);
  const atomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function spawnNeutron(rect: DOMRect) {
      setNeutrons((prev) => ({
        ...prev,
        [crypto.randomUUID()]: {
          startCoords: {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
          },
          angle: Math.random() * Math.PI * 2,
          createdAt: Date.now(),
          type: "thermal",
        },
      }));
    }
    const interval = setInterval(() => {
      if (atomRef.current) {
        const rect = atomRef.current.getBoundingClientRect();
        let hit = false;

        const neutronsInAtom = Object.entries(neutrons).filter(
          ([k, neutron]) => {
            const pos = calculateNeutronPosition();

            function calculateNeutronPosition() {
              const timeElapsed = (Date.now() - neutron.createdAt) / 1000;
              const velocity = 5000 / 20;
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

            if (neutron.type === "thermal" && amIHit && element !== "?") {
              hit = true;
              setNeutrons((prev) => {
                const newNeutrons = { ...prev };
                delete newNeutrons[k];
                return newNeutrons;
              });
            }

            return amIHit;
          }
        );

        if (hit && element !== "?") {
          switch (element) {
            case "U":
              const rect = atomRef.current.getBoundingClientRect();
              setElement(Math.random() > 0.95 ? "Xe" : "?");
              spawnNeutron(rect);
              spawnNeutron(rect);
              break;
            case "Xe":
              setElement("?");
              break;
          }
        } else if (element === "?" && Math.random() > 0.999) {
          setElement("U");
          if (Math.random() > 0.95) {
            const rect = atomRef.current.getBoundingClientRect();
            spawnNeutron(rect);
          }
        }

        if (neutronsInAtom.length > 0) {
          setWater((prev) => Math.min(prev + 2 * neutronsInAtom.length));
        } else {
          setWater((prev) => Math.max(prev - 1, 0));
        }
      }
    }, 15);

    return () => {
      clearInterval(interval);
    };
  }, [element, neutrons, setNeutrons]);

  return (
    <div
      className={cn("aspect-square size-8 p-1 transition-all")}
      style={{
        backgroundColor: blendWater(water),
      }}
    >
      <div
        ref={atomRef}
        className={cn(
          "aspect-square rounded-full z-10",
          element === "U" && "bg-blue-500",
          element === "Xe" && "bg-slate-700",
          element === "?" && "bg-slate-400"
        )}
      />
    </div>
  );
}
