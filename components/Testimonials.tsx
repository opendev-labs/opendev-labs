'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
  {
    quote: "OpenDev Labs transformed our vision into a scalable platform. The team went above and beyond.",
    author: "Sarah Chen",
    company: "TechVenture Inc",
    image: "🎯",
  },
  {
    quote: "Best software partner we've worked with. Delivery was on time, quality was exceptional.",
    author: "Marcus Johnson",
    company: "Global Solutions",
    image: "✨",
  },
  {
    quote: "They didn't just build software, they understood our business and created solutions that matter.",
    author: "Elena Rodriguez",
    company: "InnovateCorp",
    image: "🚀",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="border-b border-gray-200 bg-gray-50">
      <div className="container-max py-24 sm:py-32">
        <h2 className="mb-16">What Our Clients Say</h2>
        
        <div className="max-w-3xl">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 sm:p-14 border-2 border-gray-200"
          >
            <p className="text-xl sm:text-2xl leading-relaxed mb-8 italic">
              "{testimonials[current].quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{testimonials[current].image}</div>
              <div>
                <p className="font-bold text-base">{testimonials[current].author}</p>
                <p className="text-gray-600 text-sm">{testimonials[current].company}</p>
              </div>
            </div>
          </motion.div>

          {/* Carousel Controls */}
          <div className="flex gap-3 mt-8 justify-center">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? 'bg-black w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
