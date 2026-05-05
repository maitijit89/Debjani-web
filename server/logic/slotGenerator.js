import { format, addMinutes, parse, startOfDay } from 'date-fns';
import { CLINICS } from '../clinicData.js';
import Booking from '../models/Appointment.js';

/**
 * Generates 30-minute intervals for a clinic on a specific date,
 * marking slots as unavailable if they are already booked.
 */
export const generateAvailableSlots = async (clinicId, dateStr) => {
  const clinic = CLINICS.find(c => c.id === clinicId);
  if (!clinic) throw new Error('Clinic not found');

  const queryDate = startOfDay(new Date(dateStr));

  // Generate all possible slots
  const slots = [];
  let current = parse(clinic.startTime, 'HH:mm', new Date());
  const end = parse(clinic.endTime, 'HH:mm', new Date());

  while (current < end) {
    const slotStartTime = format(current, 'HH:mm');
    const slotEndTime = format(addMinutes(current, 30), 'HH:mm');
    
    slots.push({
      startTime: slotStartTime,
      endTime: slotEndTime
    });
    
    current = addMinutes(current, 30);
  }

  // Fetch booked slots from DB
  const bookedAppointments = await Booking.find({
    clinicLocation: clinic.name,
    appointmentDate: queryDate
  });

  const bookedStartTimes = new Set(bookedAppointments.map(app => app.startTime));

  // Return slots with availability status
  return slots.map(slot => ({
    ...slot,
    available: !bookedStartTimes.has(slot.startTime)
  }));
};
