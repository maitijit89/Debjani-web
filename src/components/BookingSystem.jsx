import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, addMinutes, startOfToday, getDay, isSameDay, parse } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const CLINICS = [
// ... existing CLINICS
  {
    id: 'mecheda',
    name: 'Mecheda',
    location: 'Mecheda Clinic',
    days: [1, 4], // Mon, Thu
    hours: { start: '15:30', end: '18:30' },
    color: 'bg-teal-500'
  },
  {
    id: 'kolaghat-rs',
    name: 'Kolaghat RS',
    location: 'Kolaghat Medical',
    days: [2], // Tue
    hours: { start: '09:00', end: '12:00' },
    color: 'bg-indigo-500'
  },
  {
    id: 'chadinda',
    name: 'Chadinda',
    location: 'Chadinda Care',
    days: [6], // Sat
    hours: { start: '09:00', end: '12:00' },
    color: 'bg-orange-500'
  },
  {
    id: 'jiakhali',
    name: 'Jiakhali',
    location: 'Jiakhali Unit',
    days: [3, 6], // Wed, Sat
    hours: { start: '15:30', end: '18:30' },
    color: 'bg-blue-500'
  },
  {
    id: 'bardabar',
    name: 'Bardabar',
    location: 'Bardabar Hospital',
    days: [0], // Sun
    hours: { start: '18:00', end: '21:00' },
    color: 'bg-purple-500'
  },
  {
    id: 'chapda',
    name: 'Chapda',
    location: 'Chapda Clinic',
    days: [5], // Fri
    hours: { start: '09:00', end: '12:00' },
    color: 'bg-rose-500'
  }
];

// API integration
const API_BASE_URL = 'http://localhost:5000/api';

const fetchBookedSlots = async (clinicId, date) => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const response = await fetch(`${API_BASE_URL}/slots?clinicId=${clinicId}&date=${dateStr}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch slots');
    return data; // Now returning full objects { startTime, endTime, available }
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
    throw error;
  }
};

const BookingSystem = () => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientInfo, setPatientInfo] = useState({ name: '', phone: '' });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Clinic, 2: Date & Time, 3: Success

  useEffect(() => {
    if (selectedClinic && selectedDate) {
      setLoading(true);
      fetchBookedSlots(selectedClinic.id, selectedDate).then(slots => {
        setBookedSlots(slots.filter(s => !s.available).map(s => s.startTime));
        setLoading(false);
      });
    }
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
    if (selectedClinic && selectedDate && selectedSlot && patientInfo.name && patientInfo.phone) {
      setLoading(true);
      try {
        const slotData = selectedSlot; 
        await bookAppointment({
          clinicId: selectedClinic.id,
          patientName: patientInfo.name,
          patientPhone: patientInfo.phone,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: slotData.startTime,
          endTime: slotData.endTime
        });
        setStep(3);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else if (!patientInfo.name || !patientInfo.phone) {
      alert("Please enter your name and phone number.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Progress Header */}
      <div className="flex items-center justify-center mb-12 space-x-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
              step >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-heading">Select a Clinic Location</h2>
              <p className="text-gray-500 mt-2">Choose the location most convenient for your visit</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLINICS.map((clinic) => (
                <motion.div
                  key={clinic.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleClinicSelect(clinic)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${clinic.color}`} />
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white ${clinic.color}`}>
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{clinic.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{clinic.location}</p>
                  <div className="flex items-center text-xs font-semibold text-primary bg-primary/5 py-2 px-3 rounded-xl w-fit">
                    <Clock size={14} className="mr-2" />
                    {clinic.hours.start} - {clinic.hours.end}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 p-6 md:p-10 border border-gray-50"
          >
            <button 
              onClick={() => setStep(1)}
              className="text-gray-400 hover:text-primary mb-6 flex items-center text-sm font-medium transition-colors"
            >
              ← Change Location
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Date Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="mr-3 text-primary" size={22} />
                  Pick a Date
                </h3>
                <div className="custom-datepicker-container">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    filterDate={isDayEnabled}
                    minDate={startOfToday()}
                    inline
                    calendarClassName="medical-calendar"
                  />
                </div>
              </div>

              {/* Slot Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="mr-3 text-primary" size={22} />
                  Available Slots
                </h3>

                {/* Patient Details Form */}
                <div className="mb-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                      <input 
                        type="text" 
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={patientInfo.phone}
                        onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                        placeholder="+91 00000-00000"
                      />
                    </div>
                  </div>
                </div>
                
                {!selectedDate ? (
                  <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-6 text-center">
                    <Calendar size={40} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Please select a date to view available times</p>
                  </div>
                ) : loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {generateTimeSlots(selectedClinic.hours.start, selectedClinic.hours.end).map((slotStr) => {
                      const isBooked = bookedSlots.includes(slotStr);
                      const isSelected = selectedSlot?.startTime === slotStr;
                      
                      return (
                        <button
                          key={slotStr}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot({
                            startTime: slotStr,
                            endTime: format(addMinutes(parse(slotStr, 'HH:mm', new Date()), 30), 'HH:mm')
                          })}
                          className={`py-3 px-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                            isBooked 
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' 
                              : isSelected
                                ? 'bg-primary text-white ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                                : 'bg-primary-light text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {slotStr}
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  disabled={!selectedSlot}
                  onClick={handleBooking}
                  className={`w-full mt-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedSlot 
                      ? 'bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20 hover:scale-[1.02]' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Appointment
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] shadow-2xl p-12 text-center border border-gray-50 max-w-lg mx-auto"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-10 text-lg">
              Your appointment is scheduled for <span className="font-bold text-primary">{format(selectedDate, 'PPP')}</span> at <span className="font-bold text-primary">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span> at <span className="font-bold text-primary">{selectedClinic.name}</span>.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setSelectedClinic(null);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
            >
              Book Another Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-datepicker-container :global(.react-datepicker) {
          border: none;
          font-family: 'Inter', sans-serif;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .custom-datepicker-container :global(.react-datepicker__month-container) {
          width: 100%;
        }
        .custom-datepicker-container :global(.react-datepicker__day--keyboard-selected) {
          background-color: transparent;
          color: inherit;
        }
        .custom-datepicker-container :global(.react-datepicker__day--selected) {
          background-color: #005f69 !important;
          border-radius: 12px;
          font-weight: bold;
        }
        .custom-datepicker-container :global(.react-datepicker__day:hover) {
          border-radius: 12px;
        }
        .custom-datepicker-container :global(.react-datepicker__header) {
          background-color: white;
          border-bottom: 1px solid #f1f5f9;
          padding-top: 20px;
        }
        .custom-datepicker-container :global(.react-datepicker__day-name) {
          color: #94a3b8;
          font-weight: 600;
          width: 3rem;
          line-height: 3rem;
        }
        .custom-datepicker-container :global(.react-datepicker__day) {
          width: 3rem;
          line-height: 3rem;
          font-weight: 500;
          color: #334155;
        }
        .custom-datepicker-container :global(.react-datepicker__day--disabled) {
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default BookingSystem;
