// Version: 1.0.1 - Fix social icons build error
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import {
  Stethoscope, Phone, Activity, Thermometer,
  HeartPulse, Brain, ShieldPlus, Baby,
  MapPin, MessageSquare, Menu, X, Award, Users,
  Clock3, Heart, Mail, ArrowRight, Sparkles, Star,
  Share2, ChevronDown
} from 'lucide-react';
import './App.css';
import stomachImg from './assets/stomach.png';
import logoImg from './assets/logo.png';
import gutBg from './assets/gut-bg.png';
import familyBg from './assets/family-bg.png';
import digestiveBg from './assets/digestive-bg.png';
import geneticBg from './assets/genetic-bg.png';
import pediatricBg from './assets/pediatric-bg.png';
import metabolicBg from './assets/metabolic-bg.png';
import gutBrainBg from './assets/gutbrain-bg.png';
import immunityBg from './assets/immunity-bg.png';
import BookingSystem from './components/BookingSystem';


const Preloader = () => {
  return (
    <motion.div
      className="preloader"
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="preloader-logo"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
      </motion.div>
      <div className="preloader-bar">
        <div className="preloader-progress" />
      </div>
      <motion.p
        className="text-white/40 text-xs font-black uppercase tracking-[0.15em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Initializing Precision Care
      </motion.p>
    </motion.div>
  );
};

const FadeIn = ({ children, direction = "up", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
        x: direction === "left" ? 50 : direction === "right" ? -50 : 0
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.string,
  delay: PropTypes.number
};

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Booking', href: '#booking' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex justify-between items-center">
        <motion.div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center p-2 shadow-xl group-hover:rotate-6 transition-transform duration-500 border border-slate-100">
            <img src={logoImg} alt="S.S. SK. SN Clinic Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 block leading-none uppercase">
              S.S. SK. SN <span className="text-primary">Clinic</span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 tracking-[0.1em] uppercase">Precision Genetic Homeopathy</span>
          </div>
        </motion.div>

        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-black text-slate-500 hover:text-primary uppercase tracking-widest transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-primary rounded-full transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
          <Magnetic>
            <button
              className="btn btn-solid w-auto!"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Now
            </button>
          </Magnetic>
        </div>

        <button 
          className="lg:hidden text-slate-900 p-2 -mr-2 bg-white/50 backdrop-blur-lg rounded-xl border border-white/60 shadow-sm" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[998] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[999] lg:hidden flex flex-col p-8 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-slate-100">
                    <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-tighter">S.S. SK. SN</span>
                </div>
                <button
                  className="p-2 bg-slate-100 rounded-xl text-slate-900"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-black text-slate-900 uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    {item.name}
                    <ChevronDown size={24} className="-rotate-90 text-slate-200 group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto space-y-6">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Need Help?</p>
                  <p className="text-sm font-bold text-slate-900">+91 8927532911</p>
                </div>
                <button
                  className="btn btn-solid w-full!"
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="container pt-24 md:pt-48 pb-20 md:pb-32">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-24 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 md:space-y-12">
          <FadeIn direction="right">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 text-primary font-black text-[10px] md:text-sm uppercase tracking-[0.15em] shadow-lg">
              <Sparkles size={16} className="text-primary-glow animate-pulse" />
              Leading Genetic Real Homeopathy
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.1}>
            <h1 className="hero-title">
              Heal your gut, <br />
              <span>restore your life.</span>
            </h1>
          </FadeIn>

          <div className="lg:hidden w-full max-w-xs mx-auto">
            <FadeIn direction="up" delay={0.15}>
              <div className="relative group">
                <motion.div 
                  className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="liquid-glass p-8 relative z-10 border-white/60">
                   <motion.img 
                    src={stomachImg} 
                    alt="Health" 
                    className="w-full h-auto drop-shadow-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   />
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn direction="right" delay={0.2}>
            <p className="text-base md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Experience precision digestive care with Dr. Debjani Maity. We combine modern genetic insight with classical homeopathy for lasting wellness.
            </p>
          </FadeIn>

          <FadeIn direction="right" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 w-full sm:w-auto">
              <Magnetic>
                <button
                  className="btn btn-solid shadow-2xl"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book Consultation
                  <ArrowRight size={20} />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  className="btn btn-outline"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Online Consultation
                </button>
              </Magnetic>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 pt-8">
              <div className="flex -space-x-3 md:-space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white shadow-xl"
                    alt="User"
                    whileHover={{ y: -10, scale: 1.1, zIndex: 10 }}
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} fill="currentColor" className="md:w-4 md:h-4" />)}
                </div>
                <p className="text-slate-900 font-black text-[10px] md:text-sm uppercase tracking-widest">10,000+ Success Stories</p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="left" delay={0.2}>
          <motion.div
            className="relative hidden lg:block parallax-container"
            whileHover={{ rotate: 1 }}
          >
            <div className="liquid-glass p-16 relative z-10 parallax-img overflow-hidden border-white/60 bg-white/50!">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent pointer-events-none" />
              <motion.img 
                src={stomachImg} 
                alt="Health" 
                className="w-full h-auto drop-shadow-[0_45px_45px_rgba(14,165,233,0.35)]"
                animate={{ 
                  y: [0, -25, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
            <motion.div 
              className="absolute -inset-20 bg-primary/20 blur-[140px] rounded-full -z-10"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

const StatsSection = () => (
  <section className="py-12 md:py-32 relative overflow-hidden">
    <div className="container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
        {[
          { id: 'happy-patients', number: "10k+", label: "Patients", icon: <Users size={24} /> },
          { id: 'experience', number: "15+", label: "Years Exp.", icon: <Award size={24} /> },
          { id: 'support', number: "24/7", label: "Support", icon: <Clock3 size={24} /> },
          { id: 'success', number: "99%", label: "Success", icon: <Activity size={24} /> }
        ].map((stat, i) => (
          <FadeIn key={stat.id} delay={i * 0.1}>
            <motion.div 
              whileHover={{ y: -15, scale: 1.02 }}
              className="text-center space-y-6 px-6 py-12 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl group transition-all duration-500 hover:bg-white/60"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center text-primary mx-auto shadow-lg border border-slate-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <div className="scale-125">
                  {i === 0 && <Users size={32} />}
                  {i === 1 && <Award size={32} />}
                  {i === 2 && <Clock3 size={32} />}
                  {i === 3 && <Activity size={32} />}
                </div>
              </div>
              <div className="space-y-1">
                <span className="stats-number !text-4xl md:!text-6xl !mb-0">{stat.number}</span>
                <span className="stats-label !text-[10px] md:!text-xs tracking-[0.25em]">{stat.label}</span>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const FeatureBanner = () => (
  <section id="specializations" className="container py-20 md:py-32">
    <FadeIn>
      <div className="bg-slate-950 rounded-[3rem] md:rounded-[5rem] p-8 md:p-32 overflow-hidden relative shadow-[0_60px_120px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 w-150 h-150 bg-primary/30 rounded-full -mr-80 -mt-80 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-120 h-120 bg-accent/15 rounded-full -ml-60 -mb-60 blur-[120px]" />

        <div className="relative z-10 grid lg:grid-cols-[1fr_0.85fr] gap-20 md:gap-32 items-center">
          <div className="space-y-10 md:space-y-14 text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Advanced digestive care <br />
              <span className="text-primary-glow">guided by genetics.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-2xl leading-relaxed max-w-xl font-medium mx-auto lg:mx-0">
              S.S. SK. SN Clinic fuses genetic mapping with precision homeopathy for lasting, side-effect-free wellness.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8 pt-6">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-white/10 text-white text-[10px] md:text-sm font-black uppercase tracking-[0.2em] shadow-2xl">
                <ShieldPlus size={24} className="text-primary-glow" />
                Safe & Natural
              </div>
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-white/10 text-white text-[10px] md:text-sm font-black uppercase tracking-[0.2em] shadow-2xl">
                <Brain size={24} className="text-primary-glow" />
                Genetic Insight
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:gap-10">
            {[
              { id: 'gut-wellness', icon: <Stethoscope size={36} />, title: "Gut Wellness", text: "Targeted care for IBS, acidity, and gastric issues.", bg: gutBg },
              { id: 'family-health', icon: <HeartPulse size={36} />, title: "Family Health", text: "Gentle solutions for all ages, infants to seniors.", bg: familyBg }
            ].map((item) => (
              <motion.div
                key={item.id}
                className="bg-slate-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] border border-white/10 group hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col items-start relative overflow-hidden min-h-[300px] md:min-h-[380px]"
                whileHover={{ x: 15, scale: 1.02 }}
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="absolute inset-0 z-0 scale-110 group-hover:scale-100 transition-transform duration-1000">
                  <img src={item.bg} alt="" className="w-full h-full object-cover opacity-15 group-hover:opacity-30 transition-opacity duration-1000" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
                </div>

                <div className="relative z-10 w-full flex flex-col h-full">
                  <div className="text-primary-glow mb-10 md:mb-12 bg-white/5 w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight uppercase">{item.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium mb-10 md:mb-12 max-w-[320px]">{item.text}</p>
                  <button className="btn btn-solid !py-4.5 !text-[11px] !px-10 mt-auto w-fit group-hover:bg-primary-glow group-hover:text-slate-950 transition-all uppercase font-black tracking-widest">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  </section>
);

const ExpertiseSection = () => {
  const services = [
    { id: 'digestive', icon: <Stethoscope size={28} />, title: "Digestive Care", desc: "Expert treatment for chronic acidity, bloating, and stomach pain.", bg: digestiveBg },
    { id: 'genetic', icon: <HeartPulse size={28} />, title: "Genetic Insight", desc: "Personalized healing guided by your unique hereditary patterns.", bg: geneticBg },
    { id: 'pediatric', icon: <Baby size={28} />, title: "Pediatric Care", desc: "Gentle homeopathic solutions for children's health and immunity.", bg: pediatricBg },
    { id: 'metabolic', icon: <Thermometer size={28} />, title: "Metabolic Health", desc: "Support for thyroid, blood sugar, and metabolic wellness.", bg: metabolicBg },
    { id: 'gut-brain', icon: <Brain size={28} />, title: "Gut-Brain Link", desc: "Integrated care for stress-related digestive and mood issues.", bg: gutBrainBg },
    { id: 'immunity', icon: <ShieldPlus size={28} />, title: "Immunity Boost", desc: "Natural protocols to strengthen your body's defense system.", bg: immunityBg }
  ];

  return (
    <section id="services" className="container py-20 md:py-32">
      <FadeIn>
        <div className="text-center mb-16 md:mb-24">
          <h2 className="section-title">Specialized Services</h2>
          <p className="section-subtitle">Comprehensive care tailored to your unique health needs.</p>
        </div>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {services.map((service, i) => (
          <FadeIn key={service.id} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -20, scale: 1.02 }}
              className="card-glass group flex flex-col items-start relative overflow-hidden h-full min-h-[400px] md:min-h-[480px] bg-white/40! hover:bg-white/70! transition-all duration-700"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="absolute inset-0 z-0 scale-110 group-hover:scale-100 transition-transform duration-1000">
                <img src={service.bg} alt="" className="w-full h-full object-cover opacity-10 group-hover:opacity-30 transition-opacity duration-1000 mix-blend-multiply" />
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/90 to-transparent" />
              </div>

              <div className="relative z-10 w-full flex flex-col h-full">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary mb-10 md:mb-14 group-hover:bg-primary group-hover:text-white transition-all duration-700 backdrop-blur-md border border-primary/20 shadow-xl group-hover:rotate-[360deg]">
                  <div className="scale-125">{service.icon}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 tracking-tighter text-slate-950 uppercase leading-none">{service.title}</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-10 md:mb-14 font-medium max-w-[280px]">{service.desc}</p>
                <button className="btn btn-solid w-full mt-auto shadow-2xl! group-hover:scale-105 transition-all !py-4.5 !text-[11px] font-black tracking-widest uppercase">
                  Book Appointment
                </button>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setLoading(false);
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (response.ok) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="container py-20 md:py-32">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-24 items-center">
        <FadeIn direction="right">
          <div className="space-y-10 md:space-y-16">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h2 className="section-title lg:text-left">Get in Touch</h2>
              <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">Have questions? Our team is here to help you on your journey to wellness.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:gap-12">
              {[
                { id: 'call', icon: <Phone size={24} />, title: "Call Us", info: "+91 8927532911" },
                { id: 'email', icon: <Mail size={24} />, title: "Email Us", info: "maitidebjit2@gmail.com" },
                { id: 'whatsapp', icon: <MessageSquare size={24} />, title: "WhatsApp", info: "Instant Chat" },
                { id: 'locations', icon: <MapPin size={24} />, title: "Locations", info: "West Bengal" }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, x: 5 }}
                  className="space-y-4 md:space-y-6 group cursor-pointer flex flex-col items-center lg:items-start p-6 md:p-0 rounded-[2rem] bg-white/40 md:bg-transparent border border-white/60 md:border-none shadow-xl md:shadow-none transition-all duration-500"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-primary shadow-2xl border border-slate-50 group-hover:bg-primary group-hover:text-white transition-all duration-700">
                    <div className="scale-110 group-hover:scale-125 transition-transform">{item.icon}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm md:text-2xl font-black tracking-tight uppercase leading-none">{item.title}</h4>
                    <p className="text-[9px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] text-center lg:text-left opacity-80">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left">
          <div className="card-glass p-8! md:p-16! relative overflow-hidden border-white/60">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase">Send a Message</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Contact our team for any enquiry</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-400"
                />
              </div>
              <textarea
                rows="5"
                placeholder="How can we help you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-8 py-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-slate-400 resize-none"
              ></textarea>

              {status.message && (
                <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
                  {status.message}
                </div>
              )}

              <Magnetic>
                <button
                  disabled={loading}
                  className={`btn btn-solid w-full! py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </Magnetic>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Attempting to subscribe:', email);
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setStatus({ type: 'success', message: 'Success! Welcome to our newsletter.' });
        setEmail('');
        // Also show a browser alert for confirmation
        alert('Thank you for subscribing! A welcome email has been sent to ' + email);
      } else {
        setStatus({ type: 'error', message: data.error || 'Subscription failed.' });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus({ type: 'error', message: 'Error: ' + error.message });
      alert('Subscription failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-32 pb-16 overflow-hidden relative">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl border border-white/10">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">S.S. SK. SN</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Precision healing through modern genetic homeopathy. Your journey to wellness begins with scientific care.
            </p>
            <div className="flex gap-6">
              {[
                { 
                  id: 'facebook', 
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ), 
                  href: 'https://www.facebook.com/share/17fQV4wHWj/' 
                },
                { 
                  id: 'instagram', 
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ), 
                  href: 'https://www.instagram.com/debjanimaity3?igsh=ZzBsamV4eXZhdWRu' 
                }
              ].map((social) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all border border-white/10"
                  whileHover={{ y: -10, rotate: 15 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black mb-10 text-white uppercase tracking-[0.3em]">Quick Links</h4>
            <ul className="space-y-6">
              {['Services', 'Booking', 'Contact', 'About'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="footer-link text-lg inline-block">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black mb-10 text-white uppercase tracking-[0.3em]">Our Clinics</h4>
            <ul className="grid gap-6">
              {['Mecheda', 'Kolaghat', 'Chadinda', 'Jiakhali', 'Bardabar', 'Chapda'].map((loc) => (
                <li key={loc} className="text-slate-400 text-lg font-medium flex items-center gap-4 group cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 group-hover:bg-primary-glow transition-all" />
                  {loc}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-sm font-black mb-10 text-white uppercase tracking-[0.3em]">Newsletter</h4>
            <p className="text-slate-400 font-medium">Get health tips and clinic updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm font-bold focus:outline-none focus:border-primary-glow transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-solid w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
              {status.message && (
                <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest mt-6 border ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">
          <p>© 2026 S.S. SK. SN CLINIC. SCIENTIFIC HEALING.</p>
          <div className="flex gap-12">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-[1001] origin-left"
            style={{ scaleX }}
          />
          <div className="bg-blobs">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
          </div>
          <Navbar />
          <HeroSection />
          <StatsSection />
          <FeatureBanner />
          <ExpertiseSection />
          <div id="booking" className="py-32">
            <BookingSystem />
          </div>
          <ContactSection />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default App;
