"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Home, Info, UtensilsCrossed, Gamepad2, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { AboutDisplay } from "../../Sections/About/AboutDisplay";

interface DockBarProps {
  aboutContent?: string;
}

export function DockBar({ aboutContent }: DockBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        sidebarRef.current && 
        buttonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { label: 'Menu', icon: UtensilsCrossed },
    { label: 'Our Story', icon: Book },
    { label: 'Play', icon: Gamepad2 },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-background hover:bg-muted transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
            
              className="absolute left-0 top-0 h-full w-[280px] bg-background border-r 
                shadow-lg z-50 flex flex-col"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6">Navigation</h2>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.label === 'Our Story') {
                          setIsAboutOpen(true);
                          setIsOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium",
                        "transition-colors hover:bg-muted",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AboutDisplay 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        content={aboutContent || ''}
      />
    </>
  );
}
