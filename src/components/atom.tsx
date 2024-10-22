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

function amIHit(neutron: Neutron, rect: DOMRect) {
  const timeElapsed = (Date.now() - neutron.createdAt) / 1000;
  const velocity = 5000 / (neutron.type === "fast" ? 20 : 40);
  const distanceMoved = velocity * timeElapsed;
  const posX = Math.cos(neutron.angle) * distanceMoved + neutron.startCoords.x;
  const posY = Math.sin(neutron.angle) * distanceMoved + neutron.startCoords.y;

  const neutronRect = {
    left: posX,
    top: posY,
    right: posX + 12,
    bottom: posY + 12,
  };
  return (
    neutronRect.left < rect.right &&
    neutronRect.right > rect.left &&
    neutronRect.top < rect.bottom &&
    neutronRect.bottom > rect.top
  );
}

export function AtomGroup({
  neutrons,
  setNeutrons,
}: {
  neutrons: Record<string, Neutron>;
  setNeutrons: Dispatch<SetStateAction<Record<string, Neutron>>>;
}) {
  const [enterers, setEnterers] = useState<Record<string, Neutron>>({});
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!groupRef.current) return;
      const rect = groupRef.current.getBoundingClientRect();
      Object.entries(neutrons).forEach(([k, neutron]) => {
        if (amIHit(neutron, rect)) {
          setEnterers((prev) => ({ ...prev, [k]: neutron }));
        }
      });
    }, 15);

    return () => {
      clearInterval(interval);
    };
  }, [neutrons]);

  return (
    <div ref={groupRef} className="grid grid-cols-4 grid-rows-3 gap-1">
      {new Array(12).fill(0).map((_, i) => (
        <Atom key={i} enterers={enterers} setNeutrons={setNeutrons} />
      ))}
    </div>
  );
}

export function Atom({
  setNeutrons,
  enterers,
}: {
  setNeutrons: Dispatch<SetStateAction<Record<string, Neutron>>>;
  enterers: Record<string, Neutron>;
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
          type: "fast",
        },
      }));
    }

    const interval = setInterval(() => {
      if (!atomRef.current) return;
      const rect = atomRef.current.getBoundingClientRect();
      let hit = false;

      const neutronsInAtom = Object.entries(enterers).filter(([k, neutron]) => {
        const isHit = amIHit(neutron, rect);

        if (neutron.type === "thermal" && isHit && element !== "?") {
          hit = true;
          setNeutrons((prev) => {
            const newNeutrons = { ...prev };
            delete newNeutrons[k];
            return newNeutrons;
          });
        }

        return isHit;
      });

      if (hit && element !== "?") {
        switch (element) {
          case "U":
            if (water >= 100 && Math.random() > 0.8) break;
            let spawns = 2;
            setElement(Math.random() > 0.7 ? "Xe" : "?");

            if (Math.random() > 0.8) {
              spawns++;
            } else if (water < 100 && Math.random() > 0.8) {
              spawns--;
            }

            if (water >= 100) {
              spawns += 2;
            }

            new Array(spawns).fill(0).forEach(() => {
              spawnNeutron(rect);
            });
            break;
          case "Xe":
            setElement("?");
            break;
        }
      }

      switch (element) {
        case "?":
          if (Math.random() > 0.995 || (water >= 100 && Math.random() > 0.99)) {
            setElement("U");
          }
          break;
        case "U":
          if (Math.random() > 0.9 || (water >= 100 && Math.random() > 0.7)) {
            setElement("?");
            spawnNeutron(rect);
          }
          break;
      }

      if (neutronsInAtom.length > 0) {
        setWater((prev) => prev + 5 * neutronsInAtom.length);
      } else if (Math.random() > 0.45) {
        setWater((prev) => Math.max(prev - 1, 0));
      }
    }, 15);

    return () => {
      clearInterval(interval);
    };
  }, [element, enterers, setNeutrons, water]);

  return (
    <div
      className="aspect-square size-8 p-1 transition-all"
      style={{
        backgroundColor: blendWater(water),
      }}
    >
      <div
        ref={atomRef}
        className={cn(
          "aspect-square rounded-full",
          element === "U" && "bg-blue-500",
          element === "Xe" && "bg-slate-700",
          element === "?" && "bg-slate-400"
        )}
      />
    </div>
  );
}
