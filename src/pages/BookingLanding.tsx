import React from 'react';
import { Navbar } from '../components/Navbar';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export const BookingLanding: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { services } = useServices();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <div className="max-w-4xl">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tight">
              Schedule your
              <br />
              consultation.
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-2xl leading-relaxed">
              Book time with our team to discuss your next project. We&apos;ll listen to your vision and show you how we can bring it to life.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <GoogleLoginButton />
                <span className="text-sm text-gray-600">Sign in with Google to continue</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <Link
                  to="/booking"
                  className="inline-flex items-center px-8 py-4 bg-black text-white text-base font-semibold hover:bg-gray-900 transition-colors"
                >
                  Start Booking
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
                <p className="text-sm text-gray-600">
                  Signed in as <span className="font-semibold text-black">{user?.email}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">500+</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">98%</div>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold mb-2">10yr</div>
              <p className="text-gray-600">Industry Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Every service your
            <br />
            product needs.
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-16 max-w-2xl leading-relaxed">
            From custom software development to strategic consulting, we have the expertise your project needs.
          </p>

          <div className="space-y-6">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="border border-black p-8 sm:p-10 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3">{service.name}</h3>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{service.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-4xl sm:text-5xl font-bold">${service.price}</div>
                    <div className="text-sm text-gray-600 mt-2 font-semibold">{service.duration}m</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="border-b border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-16 tracking-tight">
            Built by us.
            <br />
            Available for you.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            {[
              {
                title: 'Expert Team',
                description: 'Seasoned professionals with proven track records across industries and technologies.',
              },
              {
                title: 'Custom Solutions',
                description: 'No templates. We build exactly what you need, tailored to your business goals.',
              },
              {
                title: 'Transparent Process',
                description: 'Clear communication, regular updates, and realistic timelines from day one.',
              },
              {
                title: 'Long-term Partnership',
                description: 'We don\'t just build and leave. We\'re here to support your growth.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex-shrink-0 pt-1">
                  <Check className="w-6 h-6 text-red-600 font-bold" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <div className="border border-red-600 p-10 sm:p-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Let&apos;s build your
              <br />
              next big thing.
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed">
              Whether it&apos;s a website, a web app, or an AI-powered platform, we deliver products that work.
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <GoogleLoginButton />
                <span className="text-sm text-gray-600">Sign in to book</span>
              </div>
            ) : (
              <Link
                to="/booking"
                className="inline-flex items-center px-8 py-4 bg-red-600 text-white text-base font-semibold hover:bg-red-700 transition-colors"
              >
                Get in Touch
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 border-t border-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div>
              <p className="font-bold text-base sm:text-lg">OpenDev Labs</p>
              <p className="text-gray-600 text-sm mt-1">Software that thinks.</p>
            </div>
            <p className="text-sm text-gray-600">&copy; 2024 OpenDev Labs. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingLanding;
