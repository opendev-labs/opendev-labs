import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';

interface BookingStep {
  service?: string;
  date?: string;
  time?: string;
  notes?: string;
}

export const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const { services, addAppointment } = useServices();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [booking, setBooking] = useState<BookingStep>({});

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    for (let i = startHour; i < endHour; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const selectedService = services.find((s) => s.id === booking.service);

  const handleServiceSelect = (serviceId: string) => {
    setBooking({ ...booking, service: serviceId });
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setBooking({ ...booking, date });
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setBooking({ ...booking, time });
    setStep(4);
  };

  const handleConfirm = () => {
    if (!booking.service || !booking.date || !booking.time) {
      alert('Please complete all steps');
      return;
    }

    const selectedService = services.find((s) => s.id === booking.service);
    if (!selectedService) return;

    const [dateStr, monthStr, yearStr] = booking.date.split('/');
    const [hourStr, minStr] = booking.time.split(':');

    const startTime = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dateStr), parseInt(hourStr), parseInt(minStr));
    const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

    const appointment = {
      id: Date.now().toString(),
      serviceId: booking.service,
      clientEmail: user?.email || '',
      clientName: user?.name || '',
      startTime,
      endTime,
      notes: booking.notes,
      status: 'scheduled' as const,
    };

    addAppointment(appointment);
    navigate('/dashboard/appointments');
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Hi {user?.name}, let's schedule your consultation. Choose a service, date, and time that works best for you.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              <div className="hidden sm:block ml-3">
                <p className="text-xs font-medium">
                  {s === 1 && 'Service'}
                  {s === 2 && 'Date'}
                  {s === 3 && 'Time'}
                  {s === 4 && 'Confirm'}
                </p>
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    s < step ? 'bg-primary' : 'bg-card border border-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            <div className="grid gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="text-left p-6 rounded-lg border border-border hover:border-primary bg-card hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{service.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 ml-12">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {service.duration} mins
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && selectedService && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select a Date</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {getNextAvailableDates().map((date) => (
                <button
                  key={formatDate(date)}
                  onClick={() => handleDateSelect(formatDate(date))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    booking.date === formatDate(date)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium">{formatDisplayDate(date)}</div>
                  <div className="text-xs text-muted-foreground">{date.getDate()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && booking.date && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select a Time</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                    booking.time === time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50 hover:bg-card'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedService && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>
            <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Service</span>
                <span className="font-bold">{selectedService.name}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Date</span>
                <span className="font-bold">{booking.date}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Time</span>
                <span className="font-bold">{booking.time}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold">{selectedService.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-bold">{user?.email}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium mb-2 block">Additional Notes (Optional)</span>
                <textarea
                  value={booking.notes || ''}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  placeholder="Tell us more about your project or questions..."
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              >
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                disabled={
                  (step === 1 && !booking.service) ||
                  (step === 2 && !booking.date)
                }
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
