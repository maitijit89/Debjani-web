import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { CLINICS } from './clinicData.js';
import { generateAvailableSlots } from './logic/slotGenerator.js';
import { appendToSheet } from './logic/googleSheets.js';
import Appointment from './models/Appointment.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendContactEmail, sendBookingNotification, sendWelcomeEmail } from './logic/email.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_booking';
console.log('Connecting to MongoDB...');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Server will continue to run, but database operations may fail.');
  }
};

connectDB();

// Set strictQuery to true for Mongoose 6+ compatibility
mongoose.set('strictQuery', true);

// Routes

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState,
    time: new Date().toISOString()
  });
});

// Get all clinics
app.get('/api/clinics', (req, res) => {
  res.json(CLINICS);
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    await sendContactEmail({ name, email, message });
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // You could also save to a DB or Google Sheet here
    await sendWelcomeEmail(email);
    
    res.json({ message: 'Subscribed successfully! Please check your email.' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again later.' });
  }
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

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const amount = (process.env.BOOKING_FEE_INR || 50) * 100; // Amount in paise
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


// Book an appointment
app.post('/api/book-appointment', async (req, res) => {
  try {
    const { 
      clinicId, 
      patientName, 
      patientPhone, 
      patientAge, 
      patientSex, 
      patientAddress, 
      message,
      date, 
      startTime, 
      endTime,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature 
    } = req.body;


    // Basic validation
    if (!clinicId || !patientName || !patientPhone || !patientAge || !patientSex || !patientAddress || !date || !startTime || !endTime || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: 'All fields including payment info are required' });
    }

    // Verify Payment Signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }


    const clinic = CLINICS.find(c => c.id === clinicId);
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });

    // Attempt to create booking
    const booking = new Appointment({
      patientName,
      patientPhone,
      patientAge,
      patientSex,
      patientAddress,
      message,
      clinicLocation: clinic.name,
      appointmentDate: new Date(date),
      startTime,
      endTime,
      coordinates: clinic.coords,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: 'captured',
      amountPaid: process.env.BOOKING_FEE_INR || 50
    });


    await booking.save();

    // Notify clinic via email (non-blocking)
    sendBookingNotification(booking).catch(err => console.error('Email notification error:', err));

    // Sync with Google Sheets (non-blocking)
    appendToSheet(booking).catch(err => console.error('Sheet sync error:', err));

    res.status(201).json({ message: 'Appointment booked successfully', booking });
  } catch (error) {
    // Check for MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This slot is already booked. Please choose another time.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
export default app;

// Start server only if run directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Server error:', e);
    }
  });
}

