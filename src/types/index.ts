export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  icon: string;
  color: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientEmail: string;
  clientName: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  googleCalendarEventId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  date: Date;
}

export interface ServiceBooking {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  notes?: string;
}
