import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { CLINICS } from './clinicData.js';
import { generateAvailableSlots } from './logic/slotGenerator.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_booking';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Get all clinics
app.get('/api/clinics', (req, res) => {
  res.json(CLINICS);
});

// Get available slots for a clinic and date
app.get('/api/slots', async (req, res) => {
  try {
    const { clinicId, date } = req.query; // date in YYYY-MM-DD
    if (!clinicId || !date) {
      return res.status(400).json({ error: 'clinicId and date are required' });
    }
    const slots = await generateAvailableSlots(clinicId, date);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book an appointment
app.post('/api/book-appointment', async (req, res) => {
  try {
    const { clinicId, patientName, patientPhone, date, startTime, endTime } = req.body;

    // Basic validation
    if (!clinicId || !patientName || !patientPhone || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const clinic = CLINICS.find(c => c.id === clinicId);
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });

    // Attempt to create booking
    const booking = new Appointment({
      patientName,
      patientPhone,
      clinicLocation: clinic.name,
      appointmentDate: new Date(date),
      startTime,
      endTime,
      coordinates: clinic.coords
    });

    await booking.save();
    res.status(201).json({ message: 'Appointment booked successfully', booking });
  } catch (error) {
    // Check for MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This slot is already booked. Please choose another time.' });
    }
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production' || process.env.RUN_STANDALONE === 'true') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
