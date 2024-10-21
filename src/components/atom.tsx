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
  const [element] = useState<"U" | "?" | "Xe">("U");
  const [water, setWater] = useState(0);
  const atomRef = useRef<HTMLDivElement>(null);
  const [prevTest, setPrevTest] = useState(0);

  useEffect(() => {
    if (atomRef.current && Date.now() - prevTest > 250) {
      const rect = atomRef.current.getBoundingClientRect();

      const neutronsInAtom = Object.values(neutrons).filter((neutron) => {
        const neutronRect = {
          left: neutron.currentCoords.x,
          top: neutron.currentCoords.y,
          right: neutron.currentCoords.x + 10,
          bottom: neutron.currentCoords.y + 10,
        };
        return (
          neutronRect.left < rect.right &&
          neutronRect.right > rect.left &&
          neutronRect.top < rect.bottom &&
          neutronRect.bottom > rect.top
        );
      });

      if (neutronsInAtom.length > 0) {
        setWater((prev) => Math.min(prev + 15 * neutronsInAtom.length));
      } else {
        setWater((prev) => Math.max(prev - 10, 0));
      }

      setPrevTest(Date.now());
    }
  }, [neutrons, prevTest]);

  useEffect(() => {
    if (atomRef.current && Math.random() > 0.99) {
      const rect = atomRef.current.getBoundingClientRect();
      setNeutrons((prev) => ({
        ...prev,
        [crypto.randomUUID()]: {
          currentCoords: {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
          },
          destroyed: false,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          element === "U" && "bg-blue-500"
        )}
      />
    </div>
  );
}
