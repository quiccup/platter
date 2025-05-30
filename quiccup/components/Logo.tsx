import React from 'react';

export default function Logo({ className = '', color = 'white', border = 'black' }: { className?: string, color?: string, border?: string }) {
  return (
    <div className={`h-10 w-10 flex pb-1 items-center justify-center relative ${className}`}>
      <div className={`absolute h-5 w-5 bg-${color} rounded-full border border-${border} -translate-x-1 translate-y-1`}></div>
      <div className={`absolute h-5 w-5 bg-${color} rounded-full border border-${border} translate-x-1 translate-y-1`}></div>
      <div className={`absolute h-5 w-5 bg-${color} rounded-full border border-${border} translate-y-0`}></div>
    </div>
  );
} 