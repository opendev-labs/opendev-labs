'use client';

import { Header } from '@/components/Header';
import { useState } from 'react';

const services = [
  { id: 'consultation', name: 'Strategy Consultation', duration: 60, price: 500 },
  { id: 'development', name: 'Development Project Scope', duration: 90, price: 750 },
  { id: 'architecture', name: 'System Architecture Review', duration: 60, price: 600 },
];

export default function BookingPage() {
  const [step, setStep] = useState<'service' | 'date' | 'time' | 'confirm'>('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const service = services.find(s => s.id === selectedService);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-max py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mb-6">Meeting Scheduled</h1>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              We've received your booking request. Check your email for confirmation and calendar details.
            </p>
            {service && (
              <div className="bg-secondary p-8 mb-8 text-left">
                <p className="text-sm text-muted uppercase tracking-wide mb-4">Appointment Details</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Service</span>
                    <span className="font-bold">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Date</span>
                    <span className="font-bold">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Time</span>
                    <span className="font-bold">{selectedTime}</span>
                  </div>
                </div>
              </div>
            )}
            <a href="/" className="btn-primary inline-block">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container-max py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-16">
            {['service', 'date', 'time', 'confirm'].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 transition-colors ${
                  (step === s || 
                    (step === 'date' && (s === 'service' || s === 'date')) ||
                    (step === 'time' && (s === 'service' || s === 'date' || s === 'time')) ||
                    (step === 'confirm' && true))
                    ? 'bg-foreground'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <div>
              <h1 className="mb-4">Select a Service</h1>
              <p className="text-lg text-muted mb-12">
                Choose the type of consultation that best fits your needs.
              </p>

              <div className="space-y-4">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc.id);
                      setStep('date');
                    }}
                    className={`w-full p-8 text-left border-2 transition-all ${
                      selectedService === svc.id
                        ? 'border-foreground bg-secondary'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{svc.name}</h3>
                        <p className="text-muted">{svc.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${svc.price}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {step === 'date' && service && (
            <div>
              <h1 className="mb-4">Select a Date</h1>
              <p className="text-lg text-muted mb-12">
                Choose your preferred date for the {service.name}.
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-6 py-4 border-2 border-border text-foreground text-base bg-white hover:border-foreground/30 transition-colors focus:outline-none focus:border-foreground mb-8"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setStep('service');
                  }}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('time')}
                  disabled={!selectedDate}
                  className={`btn-primary flex-1 ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step === 'time' && (
            <div>
              <h1 className="mb-4">Select a Time</h1>
              <p className="text-lg text-muted mb-12">
                Choose your preferred time slot.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 border-2 text-sm font-bold transition-all ${
                      selectedTime === time
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('date')}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!selectedTime}
                  className={`btn-primary flex-1 ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && service && (
            <div>
              <h1 className="mb-4">Confirm Your Booking</h1>
              <p className="text-lg text-muted mb-12">
                Review your appointment details below.
              </p>

              <div className="border-2 border-foreground p-10 mb-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-2">Service</p>
                    <p className="font-bold text-xl">{service.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-2">Price</p>
                    <p className="font-bold text-xl">${service.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-2">Date</p>
                    <p className="font-bold text-xl">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-2">Time</p>
                    <p className="font-bold text-xl">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('time')}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`btn-primary flex-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Booking...' : 'Confirm & Schedule'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
