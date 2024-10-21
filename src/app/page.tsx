"use client";

import { Atom } from "@/components/atom";
import { Neutron } from "@/components/neutron";
import { useState } from "react";

export interface Neutron {
  currentCoords: { x: number; y: number };
  destroyed: boolean;
}

export default function Main() {
  const [neutrons, setNeutrons] = useState<Record<string, Neutron>>({});

  return (
    <main className="bg-slate-50 h-dvh w-screen flex items-center justify-center">
      <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(21,minmax(0,1fr))] gap-1">
        {new Array(840).fill(0).map((_, i) => (
          <Atom neutrons={neutrons} setNeutrons={setNeutrons} key={i} />
        ))}
      </div>
      {Object.entries(neutrons).map(
        ([k, v], i) =>
          v.destroyed === false && (
            <Neutron
              key={i}
              currentCoords={v.currentCoords}
              setCoords={(coords) =>
                setNeutrons((prev) => ({
                  ...prev,
                  [k]: { ...prev[k], currentCoords: coords },
                }))
              }
              kill={() =>
                setNeutrons((prev) => ({
                  ...prev,
                  [k]: { ...prev[k], destroyed: true },
                }))
              }
            />
          )
      )}
    </main>
  );
}
