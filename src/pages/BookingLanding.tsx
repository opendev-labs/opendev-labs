import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { ArrowRight, Check, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingLanding: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { services } = useServices();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
              Book Your{' '}
              <span className="relative">
                Consultation
                <span className="absolute bottom-2 left-0 w-full h-1 bg-primary/30"></span>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8">
              Expert services tailored to your needs. Schedule a time that works for you.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-32">
            {isAuthenticated ? (
              <>
                <Link to="/booking" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-3" />
                  </Button>
                </Link>
                <div className="text-sm text-muted-foreground">
                  Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
                </div>
              </>
            ) : (
              <>
                <GoogleLoginButton />
                <p className="text-sm text-muted-foreground">Sign in with Google to continue</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-t border-border py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 text-center">Our Services</h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Choose from our comprehensive range of professional services
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="border border-border rounded-lg p-8 hover:border-foreground/50 transition-colors duration-300">
                <Briefcase className="w-8 h-8 mb-4 text-foreground" />
                <h3 className="text-2xl font-semibold mb-3">{service.name}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">${service.price}</span>
                  <span className="text-muted-foreground">per {service.duration} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-16 text-center">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Expert Team',
                description: 'Highly qualified professionals with years of industry experience'
              },
              {
                title: 'Flexible Scheduling',
                description: 'Book appointments at times that work best for your schedule'
              },
              {
                title: 'Professional Service',
                description: 'Dedicated support and consultation tailored to your needs'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-6">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule your consultation today and let's discuss your project
          </p>
          {isAuthenticated ? (
            <Link to="/booking">
              <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Book Appointment
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
            </Link>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="font-bold text-lg">OpenDev Labs</h4>
              <p className="text-sm text-muted-foreground mt-1">Professional Services</p>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>&copy; 2024 OpenDev Labs. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingLanding;
