import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Appointment } from '../types';

interface ServicesContextType {
  services: Service[];
  appointments: Appointment[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: Date) => Appointment[];
  isServiceLoading: boolean;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Default services
const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Web Development Consultation',
    description: 'Discuss your web project needs and get expert guidance',
    duration: 30,
    price: 0,
    icon: '🌐',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    name: 'UI/UX Design Session',
    description: 'Design consultation and prototyping session',
    duration: 60,
    price: 0,
    icon: '🎨',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: '3',
    name: 'Project Strategy Meeting',
    description: 'Plan your project roadmap and technical strategy',
    duration: 45,
    price: 0,
    icon: '📋',
    color: 'from-cyan-500 to-cyan-600',
  },
];

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isServiceLoading, setIsServiceLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const storedServices = localStorage.getItem('services');
    const storedAppointments = localStorage.getItem('appointments');
    
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error('Failed to load services:', e);
      }
    }

    if (storedAppointments) {
      try {
        const parsed = JSON.parse(storedAppointments);
        // Convert date strings back to Date objects
        setAppointments(
          parsed.map((apt: any) => ({
            ...apt,
            startTime: new Date(apt.startTime),
            endTime: new Date(apt.endTime),
          }))
        );
      } catch (e) {
        console.error('Failed to load appointments:', e);
      }
    }

    setIsServiceLoading(false);
  }, []);

  const saveServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    setAppointments(updatedAppointments);
    localStorage.setItem(
      'appointments',
      JSON.stringify(
        updatedAppointments.map((apt) => ({
          ...apt,
          startTime: apt.startTime.toISOString(),
          endTime: apt.endTime.toISOString(),
        }))
      )
    );
  };

  const addService = (service: Service) => {
    saveServices([...services, service]);
  };

  const updateService = (service: Service) => {
    saveServices(services.map((s) => (s.id === service.id ? service : s)));
  };

  const deleteService = (id: string) => {
    saveServices(services.filter((s) => s.id !== id));
  };

  const addAppointment = (appointment: Appointment) => {
    saveAppointments([...appointments, appointment]);
  };

  const updateAppointment = (appointment: Appointment) => {
    saveAppointments(appointments.map((a) => (a.id === appointment.id ? appointment : a)));
  };

  const deleteAppointment = (id: string) => {
    saveAppointments(appointments.filter((a) => a.id !== id));
  };

  const getAppointmentsByDate = (date: Date): Appointment[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        appointments,
        addService,
        updateService,
        deleteService,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByDate,
        isServiceLoading,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
