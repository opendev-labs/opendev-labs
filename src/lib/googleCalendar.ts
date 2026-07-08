import { Appointment } from '../types';

/**
 * Google Calendar Integration Helper
 * This provides utilities for working with Google Calendar API
 */

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName: string;
  }>;
}

/**
 * Convert our Appointment to a Google Calendar event
 */
export const appointmentToGoogleEvent = (
  appointment: Appointment,
  serviceInfo: { name: string; description: string },
  calendarEmail: string
): GoogleCalendarEvent => {
  return {
    summary: `${serviceInfo.name} - ${appointment.clientName}`,
    description: `Client: ${appointment.clientName}\nEmail: ${appointment.clientEmail}\n\n${
      appointment.notes ? `Notes: ${appointment.notes}` : ''
    }\n\n${serviceInfo.description}`,
    start: {
      dateTime: appointment.startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: appointment.endTime.toISOString(),
      timeZone: 'UTC',
    },
    attendees: [
      {
        email: calendarEmail,
        displayName: 'Business Owner',
      },
      {
        email: appointment.clientEmail,
        displayName: appointment.clientName,
      },
    ],
  };
};

/**
 * Create a Google Calendar event
 * Requires valid Google OAuth access token
 */
export const createGoogleCalendarEvent = async (
  event: GoogleCalendarEvent,
  accessToken: string,
  calendarId: string = 'primary'
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create calendar event: ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

/**
 * Get available time slots from Google Calendar
 * This checks for busy times and returns available slots
 */
export const getAvailableSlots = async (
  date: Date,
  accessToken: string,
  calendarId: string = 'primary'
): Promise<string[]> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0);

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/freebusy',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: calendarId }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    const data = await response.json();
    const busyTimes = data.calendars[calendarId]?.busy || [];

    // Generate all 30-minute slots
    const allSlots = generateTimeSlots(startOfDay, endOfDay);

    // Filter out busy slots
    const availableSlots = allSlots.filter((slot) => {
      const slotTime = new Date(`${date.toDateString()} ${slot}`);
      return !busyTimes.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotTime >= busyStart && slotTime < busyEnd;
      });
    });

    return availableSlots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    // Return default slots if error
    return generateTimeSlots(
      new Date(date.setHours(9, 0, 0, 0)),
      new Date(date.setHours(17, 0, 0, 0))
    );
  }
};

/**
 * Generate time slots for a given day
 */
const generateTimeSlots = (startTime: Date, endTime: Date): string[] => {
  const slots: string[] = [];
  const current = new Date(startTime);

  while (current < endTime) {
    const hour = current.getHours().toString().padStart(2, '0');
    const minute = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hour}:${minute}`);
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

/**
 * Delete a Google Calendar event
 */
export const deleteGoogleCalendarEvent = async (
  eventId: string,
  accessToken: string,
  calendarId: string = 'primary'
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
};
