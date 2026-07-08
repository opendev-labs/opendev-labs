'use client';

import { motion } from 'framer-motion';

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export function AnimatedHero({ title, subtitle, children }: AnimatedHeroProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={item} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
        {title}
      </motion.h1>
      <motion.p variants={item} className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
        {subtitle}
      </motion.p>
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-6">
        {children}
      </motion.div>
    </motion.div>
  );
}
