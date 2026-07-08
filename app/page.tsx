'use client';

import { Header } from '@/components/Header';
import { PremiumCard } from '@/components/PremiumCard';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedHero } from '@/components/AnimatedHero';
import { Testimonials } from '@/components/Testimonials';
import { TeamSection } from '@/components/TeamSection';

const services = [
  {
    title: 'Custom Software Development',
    description: 'Bespoke applications built from the ground up. We craft software that scales with your business.',
    icon: '💻',
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent systems that learn and adapt. From chatbots to predictive analytics.',
    icon: '🤖',
    featured: true,
  },
  {
    title: 'Product Strategy',
    description: 'Turn ideas into market-ready products. We handle everything from conception to launch.',
    icon: '🎯',
  },
];

const portfolio = [
  {
    title: 'SaaS Platform Launch',
    description: 'Helped a startup scale from MVP to 50K users in 6 months with a robust, scalable platform.',
    category: 'SaaS',
  },
  {
    title: 'AI Chatbot Integration',
    description: 'Built a conversational AI system that reduced support costs by 60% for a Fortune 500 company.',
    category: 'AI/ML',
  },
  {
    title: 'Mobile App Redesign',
    description: 'Complete redesign and rebuild of a mobile banking app, increasing user retention by 40%.',
    category: 'Mobile',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container-max py-24 sm:py-32">
          <AnimatedHero 
            title="Software That Thinks."
            subtitle="We build intelligent software solutions for forward-thinking companies. From custom platforms to AI-powered systems, we turn complex challenges into elegant software."
          >
            <a href="/booking" className="btn-primary inline-block">
              Schedule a Consultation
            </a>
            <button className="btn-outline inline-block">
              View Our Work
            </button>
          </AnimatedHero>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-white">
        <div className="container-max py-16 sm:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">500+</div>
              <p className="text-muted text-sm">Projects Shipped</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">98%</div>
              <p className="text-muted text-sm">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">50M+</div>
              <p className="text-muted text-sm">Users Impacted</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">10yr</div>
              <p className="text-muted text-sm">Industry Leading</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-b border-border">
        <div className="container-max py-24 sm:py-32">
          <h2 className="mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.1} featured={service.featured}>
                <PremiumCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  featured={service.featured}
                />
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Team Section */}
      <TeamSection />

      {/* Portfolio Section */}
      <section className="border-b border-border bg-white">
        <div className="container-max py-24 sm:py-32">
          <h2 className="mb-4">Featured Work</h2>
          <p className="text-lg text-muted max-w-2xl mb-16">
            We've helped dozens of companies build products that matter. Here are some recent highlights.
          </p>
          <div className="space-y-6">
            {portfolio.map((project, idx) => (
              <div key={idx} className="border border-border p-8 sm:p-10 hover:border-foreground/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-muted text-base leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex-shrink-0 px-4 py-2 bg-secondary text-foreground text-xs font-bold tracking-wide">
                    {project.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-border bg-white">
        <div className="container-max py-24 sm:py-32">
          <div className="border-2 border-accent p-12 sm:p-16">
            <h2 className="mb-6">Ready to Build Something Great?</h2>
            <p className="text-lg text-muted max-w-2xl mb-10">
              Let's talk about your next project. We'll listen, ask hard questions, and build something that matters.
            </p>
            <a href="/booking" className="btn-primary inline-block">
              Start a Conversation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="container-max py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <p className="font-bold text-base">OpenDev Labs</p>
              <p className="text-sm text-muted mt-1">Software That Thinks</p>
            </div>
            <p className="text-sm text-muted">&copy; 2024 OpenDev Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
