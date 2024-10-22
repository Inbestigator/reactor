"use client";

import { AtomGroup } from "@/components/atom";
import { Control } from "@/components/control";
import { Moderator } from "@/components/moderator";
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
  const [raised, setRaised] = useState(0);

  return (
    <main className="bg-slate-50 h-dvh w-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-black">
        Neutrons: {Object.keys(neutrons).length}
      </h1>
      <div className="grid grid-cols-10 grid-rows-7 relative gap-0 lg:gap-0.5 xl:gap-1">
        {new Array(70).fill(0).map((_, i) => (
          <AtomGroup neutrons={neutrons} setNeutrons={setNeutrons} key={i} />
        ))}
        <div className="absolute inset-0 flex items-start justify-between overflow-hidden">
          {new Array(21)
            .fill(0)
            .map((_, i) =>
              i % 2 ? (
                <Control
                  neutrons={neutrons}
                  setNeutrons={setNeutrons}
                  raised={raised}
                  key={i}
                />
              ) : (
                <Moderator
                  neutrons={neutrons}
                  setNeutrons={setNeutrons}
                  key={i}
                />
              )
            )}
        </div>
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
      <div className="flex items-center gap-4 p-2">
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square size-8 transition-all bg-blue-200 inline-block mr-2" />
          Water
        </div>
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square rounded-full size-6 bg-blue-500 inline-block mr-2" />
          Uranium
        </div>
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square rounded-full size-6 bg-slate-700 inline-block mr-2" />
          Xenon
        </div>
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square rounded-full size-6 bg-slate-400 inline-block mr-2" />
          Non-Uranium
        </div>
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square rounded-full bg-slate-700 size-3 p-0.5 inline-block mr-2" />
          Thermal Neutron
        </div>
        <div className="text-xl font-bold text-black flex items-center">
          <div className="aspect-square rounded-full bg-slate-700 size-3 p-0.5 inline-block mr-2">
            <div className="aspect-square rounded-full bg-white" />
          </div>
          Fast Neutron
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={raised}
        onChange={(e) => setRaised(Number(e.target.value))}
      />
    </main>
  );
}
