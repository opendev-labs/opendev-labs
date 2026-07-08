import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { ArrowRight, Calendar, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingLanding: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { services } = useServices();
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'about'>('services');

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-medium text-primary">✨ Professional Services</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight">
              Build Something{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert development, design, and strategy consulting. Book your consultation today and let's create your next big idea together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <>
                  <Link to="/booking">
                    <Button size="lg" className="w-full sm:w-auto">
                      Book an Appointment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="w-full sm:w-auto">
                  <GoogleLoginButton size="lg" text="Sign in to Book" />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-16 pt-12 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="text-sm text-muted-foreground mt-2">Projects Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">98%</div>
                <p className="text-sm text-muted-foreground mt-2">Client Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">10+</div>
                <p className="text-sm text-muted-foreground mt-2">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Choose from our range of professional services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-xl bg-background border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">{service.duration} mins</span>
                    {service.price > 0 && (
                      <span className="text-lg font-bold text-foreground">${service.price}</span>
                    )}
                  </div>
                  {isAuthenticated && (
                    <Button
                      size="sm"
                      className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center">Why Choose Us</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Google Calendar Sync</h3>
                <p className="text-muted-foreground">
                  Real-time availability sync. Book directly into our calendar with instant confirmation.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                <p className="text-muted-foreground">
                  Experienced professionals with proven track records in web development, design, and strategy.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quick Turnaround</h3>
                <p className="text-muted-foreground">
                  Fast, efficient service delivery. We respect your time and deliver results quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a consultation with our team today. Let's discuss your project and create a plan for success.
          </p>
          {isAuthenticated ? (
            <Link to="/booking">
              <Button size="lg">
                Book Your Appointment Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <GoogleLoginButton size="lg" text="Sign in to Book" />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  OD
                </div>
                <span className="font-bold">OpenDev</span>
              </div>
              <p className="text-muted-foreground text-sm">Expert development and design services.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Web Development</a></li>
                <li><a href="#" className="hover:text-foreground transition">UI/UX Design</a></li>
                <li><a href="#" className="hover:text-foreground transition">Strategy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; 2024 OpenDev. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingLanding;
