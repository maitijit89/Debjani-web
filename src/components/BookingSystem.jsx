import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addMinutes, startOfToday, getDay, parse, addMonths, endOfMonth } from 'date-fns';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, CheckCircle2, ChevronRight, Loader2, 
  UserRound, Clock3 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CLINICS = [
  {
    id: 'mecheda',
    name: 'Mecheda',
    location: 'S.S. SK. SN Clinic — Mecheda',
    days: [1, 4], // Mon, Thu
    hours: { start: '15:30', end: '18:30' },
    schedule: 'Mon / Thu • 3:30 PM - 6:30 PM',
    color: 'bg-teal-500'
  },
  {
    id: 'kolaghat-rs',
    name: 'Kolaghat RS',
    location: 'S.S. SK. SN Clinic — Kolaghat RS',
    days: [2], // Tue
    hours: { start: '09:00', end: '12:00' },
    schedule: 'Tue • 9:00 AM - 12:00 PM',
    color: 'bg-indigo-500'
  },
  {
    id: 'chadinda',
    name: 'Chadinda',
    location: 'S.S. SK. SN Clinic — Chadinda',
    days: [6], // Sat
    hours: { start: '09:00', end: '12:00' },
    schedule: 'Sat • 9:00 AM - 12:00 PM',
    color: 'bg-orange-500'
  },
  {
    id: 'jiakhali',
    name: 'Jiakhali',
    location: 'S.S. SK. SN Clinic — Jiakhali',
    days: [3, 6], // Wed, Sat
    hours: { start: '15:30', end: '18:30' },
    schedule: 'Wed / Sat • 3:30 PM - 6:30 PM',
    color: 'bg-blue-500'
  },
  {
    id: 'bardabar',
    name: 'Bardabar',
    location: 'S.S. SK. SN Clinic — Bardabar',
    days: [0], // Sun
    hours: { start: '18:00', end: '21:00' },
    schedule: 'Sun • 6:00 PM - 9:00 PM',
    color: 'bg-purple-500'
  },
  {
    id: 'chapda',
    name: 'Chapda',
    location: 'S.S. SK. SN Clinic — Chapda',
    days: [5], // Fri
    hours: { start: '09:00', end: '12:00' },
    schedule: 'Fri • 9:00 AM - 12:00 PM',
    color: 'bg-rose-500'
  }
];

const Magnetic = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  const reset = () => setPosition({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

Magnetic.propTypes = {
  children: PropTypes.node.isRequired
};

// API integration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';


const fetchBookedSlots = async (clinicId, date) => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const response = await fetch(`${API_BASE_URL}/slots?clinicId=${clinicId}&date=${dateStr}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch slots');
    return data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
};

const bookAppointment = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/book-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to book appointment');
    return data;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
};

const BookingSystem = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientInfo, setPatientInfo] = useState({ 
    name: '', 
    phone: '', 
    age: '', 
    sex: '', 
    address: '', 
    message: '' 
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [slotError, setSlotError] = useState(null);


  useEffect(() => {
    let isMounted = true;
    if (selectedClinic && selectedDate) {
      const loadSlots = async () => {
        setLoading(true);
        try {
          const slots = await fetchBookedSlots(selectedClinic.id, selectedDate);
          if (isMounted) {
            setBookedSlots(slots.filter(s => !s.available).map(s => s.startTime));
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      loadSlots();
    }
    return () => { isMounted = false; };
  }, [selectedClinic, selectedDate]);

  const generateTimeSlots = (startStr, endStr) => {
    const slots = [];
    let current = parse(startStr, 'HH:mm', new Date());
    const end = parse(endStr, 'HH:mm', new Date());
    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const isDayEnabled = (date) => {
    if (!selectedClinic) return false;
    return selectedClinic.days.includes(getDay(date));
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setSelectedDate(null);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleBooking = async () => {
    if (!isFormValid) {
      alert("Please complete all fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Razorpay Order
      const orderResponse = await fetch(`${API_BASE_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const orderData = await orderResponse.json();

      if (!orderResponse.ok) throw new Error(orderData.error || 'Failed to create payment order');

      // 2. Open Razorpay Checkout
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        throw new Error('Razorpay Key ID is missing. Please check your Vercel environment variables.');
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'S.S. SK. SN Clinic',
        description: `Advance for Consultation at ${selectedClinic.name}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Confirm Booking with Payment Details
            await bookAppointment({
              clinicId: selectedClinic.id,
              patientName: patientInfo.name,
              patientPhone: patientInfo.phone,
              patientAge: patientInfo.age,
              patientSex: patientInfo.sex,
              patientAddress: patientInfo.address,
              message: patientInfo.message,
              date: format(selectedDate, 'yyyy-MM-dd'),
              startTime: selectedSlot.startTime,
              endTime: selectedSlot.endTime,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            setStep(3);
            confetti({
              particleCount: 200,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#0ea5e9', '#7dd3fc', '#f43f5e']
            });
          } catch (error) {
            alert("Booking confirmation failed: " + error.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: patientInfo.name,
          contact: patientInfo.phone
        },
        theme: {
          color: '#0ea5e9'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      alert("Error starting payment process: " + error.message);
      setLoading(false);
    }
  };


  const isFormValid = !!(
    selectedSlot && 
    patientInfo.name && 
    patientInfo.phone && 
    patientInfo.age && 
    patientInfo.sex && 
    patientInfo.address
  );

  return (
    <div className="container">
      <div className="text-center mb-24">
        <h2 className="section-title">Schedule Consultation</h2>
        <p className="section-subtitle">Choose your preferred clinic and secure your appointment in seconds.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {CLINICS.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleClinicSelect(clinic)}
                className="liquid-glass p-10 cursor-pointer group flex flex-col items-start border-white/40 hover:border-primary/30"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-10 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MapPin size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">{clinic.name}</h3>
                <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">{clinic.location}</p>
                <div className="mt-auto w-full space-y-8">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-white/50 px-5 py-3 rounded-2xl shadow-inner inline-block border border-white/60">
                    {clinic.schedule}
                  </div>
                  <button className="btn btn-solid w-full group-hover:scale-105 transition-all">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass p-12 md:p-16 border-white/60"
          >
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-400 hover:text-primary mb-12 text-xs font-black uppercase tracking-[0.2em] transition-all group"
            >
              <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              Change Location
            </button>

            <div className="grid lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Date</h3>
                </div>
                <div className="custom-datepicker-container bg-white/30 p-8 rounded-[40px] shadow-inner border border-white/40">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
                    filterDate={isDayEnabled}
                    minDate={startOfToday()}
                    maxDate={endOfMonth(addMonths(startOfToday(), 1))}
                    inline
                  />

                </div>
              </div>

              <div className="space-y-16">
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                      <UserRound size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Patient Info</h3>
                  </div>

                  <div className="grid gap-6">
                    <input 
                      type="text" 
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-12 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-black placeholder:text-slate-400"
                      placeholder="Full Name"
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <input 
                        type="tel" 
                        value={patientInfo.phone}
                        onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                        className="w-full px-8 py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-12 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-black placeholder:text-slate-400"
                        placeholder="Phone Number"
                      />
                      <input 
                        type="number" 
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                        className="w-full px-8 py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-12 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-black placeholder:text-slate-400"
                        placeholder="Age"
                      />
                    </div>
                    <div className="flex gap-4">
                      {['Male', 'Female', 'Other'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setPatientInfo({...patientInfo, sex: option})}
                          className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all border ${
                            patientInfo.sex === option
                              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                              : 'bg-white/40 text-slate-500 border-white/60 hover:bg-white/60'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={patientInfo.address}
                      onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                      className="w-full px-8 py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-12 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-black placeholder:text-slate-400"
                      placeholder="Address"
                    />
                    <textarea 
                      value={patientInfo.message}
                      onChange={(e) => setPatientInfo({...patientInfo, message: e.target.value})}
                      rows="3"
                      className="w-full px-8 py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-12 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-black placeholder:text-slate-400 resize-none"
                      placeholder="Booking Message (Optional)"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Available Slots</h4>
                  {selectedDate ? (
                    <div className="relative">
                      {loading ? (
                        <div className="h-48 flex items-center justify-center text-primary">
                          <Loader2 className="animate-spin" size={48} />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {generateTimeSlots(selectedClinic.hours.start, selectedClinic.hours.end).map((slotStr) => {
                            const isBooked = bookedSlots.includes(slotStr);
                            const isSelected = selectedSlot?.startTime === slotStr;
                            
                            let buttonClass = "bg-white/60 text-slate-600 border border-white/80 hover:bg-white hover:text-primary shadow-sm";
                            if (isBooked) {
                              buttonClass = "bg-slate-100 text-slate-300 cursor-not-allowed border-none opacity-50";
                            } else if (isSelected) {
                              buttonClass = "bg-primary text-white shadow-[0_15px_30px_rgba(14,165,233,0.3)] scale-110 z-10";
                            }

                            return (
                              <motion.button
                                key={slotStr}
                                whileHover={isBooked ? {} : { scale: 1.1, y: -5 }}
                                whileTap={isBooked ? {} : { scale: 0.95 }}
                                onClick={() => {
                                  if (isBooked) {
                                    setSlotError("This slot is already booked. Please choose another time.");
                                    setTimeout(() => setSlotError(null), 3000);
                                    return;
                                  }
                                  setSlotError(null);
                                  setSelectedSlot({
                                    startTime: slotStr,
                                    endTime: format(addMinutes(parse(slotStr, 'HH:mm', new Date()), 30), 'HH:mm')
                                  });
                                }}

                                className={`py-4 rounded-2xl text-xs font-black transition-all ${buttonClass}`}
                              >
                                {slotStr}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                      <AnimatePresence>
                        {slotError && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-12 left-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl shadow-lg text-center z-20 border border-rose-400"
                          >
                            {slotError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center bg-white/20 rounded-[40px] border-4 border-dashed border-white/40 text-center p-10">
                      <Clock3 size={40} className="text-white/60 mb-4 animate-pulse" />
                      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Select a date to view times</p>
                    </div>
                  )}
                </div>

                <Magnetic>
                  <button
                    disabled={loading || !isFormValid}
                    onClick={handleBooking}
                    className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl ${
                      !loading && isFormValid
                        ? 'bg-primary text-white hover:shadow-[0_25px_50px_rgba(14,165,233,0.4)]' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Secure Appointment'}
                  </button>
                </Magnetic>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="liquid-glass p-16 md:p-24 text-center max-w-2xl mx-auto border-white/80"
          >
            <motion.div 
              className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <CheckCircle2 size={56} />
            </motion.div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Appointment Secured</h2>
            <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium">
              Your visit is confirmed for <span className="text-primary font-black">{format(selectedDate, 'PPP')}</span> at <span className="text-primary font-black">{selectedSlot?.startTime}</span>. We look forward to seeing you.
            </p>
            <button
              onClick={() => { 
                setStep(1); 
                setSelectedClinic(null); 
                setSelectedDate(null); 
                setSelectedSlot(null); 
                setPatientInfo({ 
                  name: '', 
                  phone: '', 
                  age: '', 
                  sex: '', 
                  address: '', 
                  message: '' 
                }); 
              }}
              className="btn btn-solid w-full"
            >
              Schedule Another Visit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingSystem;
