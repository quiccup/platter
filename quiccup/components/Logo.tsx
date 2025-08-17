import React from 'react';

export default function Logo({ className = '', color = 'white' }: { className?: string, color?: string }) {
  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      {/* Bottom circles with thicker outlines */}
      <div className="absolute h-5 w-5 -translate-x-1 translate-y-1">
        <div className={`h-full w-full bg-${color} rounded-full ring-[1.5px] ring-offset-1 ring-black`}></div>
      </div>
      <div className="absolute h-5 w-5 translate-x-1 translate-y-1">
        <div className={`h-full w-full bg-${color} rounded-full ring-[1.5px] ring-offset-1 ring-black`}></div>
      </div>
      {/* Top circle with thicker outline */}
      <div className="absolute h-5 w-5">
        <div className={`h-full w-full bg-${color} rounded-full ring-[1.5px] ring-offset-1 ring-black`}></div>
      </div>
    </div>
  );
} 