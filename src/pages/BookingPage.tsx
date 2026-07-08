import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const { services, addAppointment } = useServices();
  const [step, setStep] = useState<'service' | 'date' | 'time' | 'confirm'>('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const service = services.find(s => s.id === selectedService);

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      addAppointment({
        id: Date.now().toString(),
        serviceId: selectedService,
        clientEmail: user?.email || '',
        clientName: user?.name || '',
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });
      setBookingComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Appointment Confirmed</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Your appointment has been successfully booked. A confirmation email has been sent to{' '}
              <span className="font-semibold text-foreground">{user?.email}</span>
            </p>
            
            {service && (
              <div className="bg-secondary/30 rounded-lg p-8 text-left mb-8">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-semibold text-foreground">{service.name}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold text-foreground">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold text-foreground">{service.duration} minutes</span>
                  </div>
                </div>
              </div>
            )}

            <Link to="/book">
              <Button className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link to="/book" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Link>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-12">
          {['service', 'date', 'time', 'confirm'].map((s, idx) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === s || 
                (step === 'date' && (s === 'service' || s === 'date')) ||
                (step === 'time' && (s === 'service' || s === 'date' || s === 'time')) ||
                (step === 'confirm' && true)
                  ? 'bg-primary'
                  : 'bg-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Select a Service</h1>
              <p className="text-lg text-muted-foreground">Choose the service you'd like to book</p>
            </div>

            <div className="space-y-4 mb-8">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => {
                    setSelectedService(svc.id);
                    setStep('date');
                  }}
                  className={`w-full p-6 text-left border rounded-lg transition-all ${
                    selectedService === svc.id
                      ? 'border-primary bg-secondary/20'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{svc.name}</h3>
                      <p className="text-muted-foreground text-sm">{svc.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold">${svc.price}</div>
                      <div className="text-sm text-muted-foreground">{svc.duration}m</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 'date' && (
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Select a Date</h1>
              <p className="text-lg text-muted-foreground">Choose your preferred appointment date</p>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary mb-8"
            />

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedService(null);
                  setStep('service');
                }}
                className="flex-1 border border-border text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('time')}
                disabled={!selectedDate}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 'time' && (
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Select a Time</h1>
              <p className="text-lg text-muted-foreground">Choose your preferred time slot</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-foreground/30 text-foreground'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('date')}
                className="flex-1 border border-border text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                disabled={!selectedTime}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && service && (
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Confirm Appointment</h1>
              <p className="text-lg text-muted-foreground">Review your booking details</p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-8 mb-8 space-y-6">
              <div className="border-b border-border pb-6">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">Service</h3>
                <p className="text-xl font-semibold">{service.name}</p>
                <p className="text-muted-foreground text-sm mt-2">{service.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Date</p>
                  <p className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Time</p>
                  <p className="font-semibold">{selectedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Duration</p>
                  <p className="font-semibold">{service.duration} minutes</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Client</p>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('time')}
                className="flex-1 border border-border text-foreground"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {isSubmitting ? 'Booking...' : 'Confirm & Book'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
