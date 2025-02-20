"use client";

import { Dock, DockIcon } from "@/components/ui/dock";

export function DockBar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <Dock direction="middle" className="min-w-[250px] border-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-full">
        <DockIcon>
          <span className="text-sm font-medium hover:text-orange-600 transition-colors">
            About
          </span>
        </DockIcon>
        <DockIcon>
          <span className="text-sm font-medium hover:text-blue-600 transition-colors">
            Info
          </span>
        </DockIcon>
        <DockIcon>
          <span className="text-sm font-medium hover:text-red-600 transition-colors">
            Menu
          </span>
        </DockIcon>
        <DockIcon>
          <span className="text-sm font-medium hover:text-purple-600 transition-colors">
            Play
          </span>
        </DockIcon>
      </Dock>
    </div>
  );
}
