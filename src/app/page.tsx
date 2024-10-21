"use client";

import { Atom } from "@/components/atom";
import { Neutron } from "@/components/neutron";
import { useState } from "react";

export interface Neutron {
  startCoords: { x: number; y: number };
  angle: number;
  createdAt: number;
  type: "fast" | "thermal";
}

export default function Main() {
  const [neutrons, setNeutrons] = useState<Record<string, Neutron>>({});

  return (
    <main className="bg-slate-50 h-dvh w-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-black">
        Neutrons: {Object.keys(neutrons).length}
      </h1>
      <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(21,minmax(0,1fr))] gap-1">
        {new Array(840).fill(0).map((_, i) => (
          <Atom neutrons={neutrons} setNeutrons={setNeutrons} key={i} />
        ))}
      </div>
      {Object.entries(neutrons).map(([k, v]) => (
        <Neutron
          key={k}
          startCoords={v.startCoords}
          angle={v.angle}
          kill={() =>
            setNeutrons((prev) => {
              const newNeutrons = { ...prev };
              delete newNeutrons[k];
              return newNeutrons;
            })
          }
          type={v.type}
        />
      ))}
    </main>
  );
}
