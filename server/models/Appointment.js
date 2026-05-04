import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  clinicLocation: {
    type: String, // e.g., "Mecheda"
    required: true,
    index: true
  },
  appointmentDate: {
    type: Date,  // e.g., 2026-05-11
    required: true,
    index: true
  },
  startTime: {
    type: String,      // e.g., "15:30"
    required: true
  },
  endTime: {
    type: String,      // e.g., "16:00"
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique compound index to prevent double-booking for the same clinic, date, and start time
// Note: We use startOfDay for the date part if we want to ensure uniqueness per calendar day
BookingSchema.index({ clinicLocation: 1, appointmentDate: 1, startTime: 1 }, { unique: true });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
