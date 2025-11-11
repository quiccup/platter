import React from 'react';

type LogoProps = {
  className?: string;
  color?: string;
  border?: string;
  borderWidth?: number;
};

export default function Logo({
  className = '',
  color = '#000000',
  border = '#ffffff',
  borderWidth = 1,
}: LogoProps) {
  const circleStyle: React.CSSProperties = {
    backgroundColor: color,
    borderColor: border,
    borderWidth,
    borderStyle: 'solid',
  };

  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      {/* Bottom circles with thicker outlines */}
      <div className="absolute h-5 w-5 -translate-x-1 translate-y-1">
        <div className="h-full w-full rounded-full" style={circleStyle}></div>
      </div>
      <div className="absolute h-5 w-5 translate-x-1 translate-y-1">
        <div className="h-full w-full rounded-full" style={circleStyle}></div>
      </div>
      {/* Top circle with thicker outline */}
      <div className="absolute h-5 w-5">
        <div className="h-full w-full rounded-full" style={circleStyle}></div>
      </div>
    </div>
  );
} 