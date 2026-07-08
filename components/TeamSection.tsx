'use client';

import { motion } from 'framer-motion';

const team = [
  {
    name: "Alex Chen",
    role: "Co-founder & CTO",
    bio: "10+ years building scalable systems",
    icon: "👨‍💻",
  },
  {
    name: "Jordan Smith",
    role: "Co-founder & CEO",
    bio: "Product visionary, startup ecosystem",
    icon: "👩‍💼",
  },
  {
    name: "Taylor Kim",
    role: "Lead Designer",
    bio: "Beautiful interfaces, thoughtful UX",
    icon: "🎨",
  },
  {
    name: "Morgan Lee",
    role: "Full Stack Engineer",
    bio: "React, Node.js, cloud infrastructure",
    icon: "⚙️",
  },
];

export function TeamSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="border-b border-gray-200">
      <div className="container-max py-24 sm:py-32">
        <h2 className="mb-4">Meet Our Team</h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-16">
          World-class engineers, designers, and strategists working to build the future.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="p-8 border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{member.icon}</div>
              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-red-600 font-semibold mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
