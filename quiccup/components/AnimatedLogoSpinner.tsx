import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function AnimatedLogoSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
      style={{ display: 'inline-block' }}
    >
      <Logo className="h-8 w-8" />
    </motion.div>
  );
} 