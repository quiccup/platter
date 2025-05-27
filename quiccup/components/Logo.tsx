import React from 'react';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`h-10 w-10 flex pb-1 items-center justify-center relative ${className}`}>
      <div className="absolute h-5 w-5 bg-black rounded-full border border-white -translate-x-1 translate-y-1"></div>
      <div className="absolute h-5 w-5 bg-black rounded-full border border-white translate-x-1 translate-y-1"></div>
      <div className="absolute h-5 w-5 bg-black rounded-full border border-white translate-y-0"></div>
    </div>
  );
} 