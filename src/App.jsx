import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Stethoscope, Phone, Calendar, Baby, Flower2, Activity, Thermometer, 
  HeartPulse, Brain, UserRound, ShieldPlus, Globe, Camera, Link, 
  MapPin, MessageSquare, Menu, X, ChevronRight, Award, Users, 
  Clock3, Map, Heart, Mail, ArrowRight, Sparkles, Star
} from 'lucide-react';
import './App.css';
import stomachImg from './assets/stomach.png';
import logoImg from './assets/logo.png';
import BookingSystem from './components/BookingSystem';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="custom-cursor hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="custom-cursor-dot hidden md:block fixed top-0 left-0 w-1 h-1 bg-primary rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

const WordRotate = ({ words, duration = 2000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
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

const CountUp = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    let totalMiliseconds = 2000;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div 
      className="stat-card glass p-8 rounded-[32px] border border-white/20 text-center"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
        {icon}
      </div>
      <div className="text-4xl font-extrabold text-gray-900 mb-2 font-heading">
        {count}{suffix}
      </div>
      <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}>
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[101]"
          style={{ scaleX }}
        />
        <div className="container">
          <div className={`glass px-8 py-4 rounded-[32px] border border-white/20 flex justify-between items-center transition-all duration-500 ${
            scrolled ? 'shadow-2xl shadow-primary/10 backdrop-blur-2xl bg-white/80' : 'bg-white/40 backdrop-blur-md'
          }`}>
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-gray-900 block leading-none font-heading uppercase">
                  Doctor <span className="text-primary">3D</span>
                </span>
                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase opacity-70">Medical Clinic</span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {['Features', 'Services', 'Specialists', 'Reviews'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-bold text-gray-600 hover:text-primary transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Magnetic>
                <button 
                  className="btn btn-solid !py-3 !px-8 text-sm"
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book Now
                </button>
              </Magnetic>
            </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-nav open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {['Services', 'Specializations', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)}>
                {item}
              </a>
            ))}
            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button 
                className="btn btn-solid" 
                style={{ width: '100%' }}
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Appointment
              </button>
              <a 
                href="https://wa.me/910000000000" 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline" 
                style={{ width: '100%', textAlign: 'center', display: 'block' }}
              >
                WhatsApp Consult
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const stomachY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      stomachY.set(latest * 0.15);
    });
  }, [scrollY, stomachY]);

  return (
    <section className="hero container relative overflow-hidden flex flex-col lg:flex-row items-center justify-between py-12 gap-12">
      <div className="hero-content relative z-10 max-w-2xl">
        <motion.div 
          className="hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-primary font-bold text-xs uppercase tracking-widest mb-6"
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="status-dot w-2 h-2 bg-primary rounded-full animate-pulse" />
          <UserRound size={14} />
          Expert Gastroenterology Care
        </motion.div>

        <motion.h1 
          className="hero-title text-5xl md:text-7xl font-heading leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          A healthy stomach <br />
          means a <span className="text-primary italic"><WordRotate words={["vibrant life", "healthy mind", "stronger body"]} />.</span>
        </motion.h1>

        <motion.p 
          className="hero-desc text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Specializing in advanced diagnostic techniques and personalized treatment for all digestive and liver disorders. Bridging the gap between 3D technology and compassionate care.
        </motion.p>

        <motion.div 
          className="hero-actions flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <Magnetic>
            <button 
              className="btn btn-solid flex items-center gap-2"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar size={18} />
              Book Checkup
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-outline flex items-center gap-2 group">
              <Phone size={18} />
              Consultation
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div 
        className="hero-image-container relative hidden lg:flex flex-1 items-center justify-center"
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div 
          className="hero-card glass relative p-8 rounded-3xl overflow-hidden border border-white/30 shadow-2xl"
          style={{ y: stomachY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <img src={stomachImg} alt="3D Stomach Illustration" className="hero-image w-[450px] relative z-10 filter drop-shadow-2xl" />
          
          <motion.div 
            className="hero-overlay-card absolute -bottom-6 -left-6 glass p-5 rounded-2xl shadow-2xl border border-white/20 max-w-[200px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                <Activity size={16} />
              </div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">3D Precision</span>
            </div>
            <p className="text-xs font-medium text-gray-700 leading-tight">
              Mapping gastrointestinal health with sub-millimeter accuracy.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const FeatureBanner = () => (
  <section id="specializations" className="feature-banner-section container">
    <motion.div 
      className="feature-banner"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="banner-left">
        <h2 className="banner-title">
          Specially trained in solving problems of <span>women and children.</span>
        </h2>
        <p className="banner-desc">
          Expert clinical care tailored for the most delicate health needs. Bringing Kolkata's leading medical training to your local doorstep.
        </p>
      </div>
      <div className="banner-right">
        {[
          { icon: <Flower2 />, title: "Maternal Care", text: "Holistic support for women's wellness." },
          { icon: <Baby />, title: "Pediatrics", text: "Advanced care for growing lives." }
        ].map((spec, i) => (
          <motion.div 
            key={i} 
            className="spec-card"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * i }}
          >
            <div className="spec-icon">{spec.icon}</div>
            <h3 className="spec-title">{spec.title}</h3>
            <p className="spec-text">{spec.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

const ExpertiseSection = () => {
  const services = [
    { icon: <Activity />, title: "Stomach Diseases", desc: "Comprehensive diagnostics and treatment for digestive health and gastric complications." },
    { icon: <Thermometer />, title: "Sugar & Thyroid", desc: "Expert management of metabolic disorders and hormonal balance for long-term health." },
    { icon: <HeartPulse />, title: "Cholesterol", desc: "Personalized lipid management strategies to maintain cardiovascular wellness." },
    { icon: <Brain />, title: "Paralysis Recovery", desc: "Neurological support and physical rehabilitation pathways for recovery." },
    { icon: <Flower2 />, title: "Women's Health", desc: "Specialized care for reproductive health, bone density, and maternity support." },
    { icon: <ShieldPlus />, title: "General Wellness", desc: "Routine checkups and preventative medicine to ensure your family's daily vitality." }
  ];

  return (
    <section id="services" className="expertise container">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Clinical Expertise
      </motion.h2>
      <motion.p 
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Providing advanced treatments for a wide range of medical conditions with clinical precision.
      </motion.p>
      <div className="expertise-grid">
        {services.map((service, index) => (
          <motion.div 
            key={index} 
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -12 }}
          >
            <div className="service-icon-box">
              {service.icon}
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-desc">{service.desc}</p>
            <motion.div 
              className="btn-text" 
              style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}
              whileHover={{ x: 5 }}
            >
              Learn More <ChevronRight size={16} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const StatsSection = () => (
  <section className="stats-section container py-24 relative z-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { icon: <Users size={28} />, value: "10k+", label: "Happy Patients" },
        { icon: <Award size={28} />, value: "15+", label: "Years Experience" },
        { icon: <Clock3 size={28} />, value: "24/7", label: "Support" },
        { icon: <Activity size={28} />, value: "99%", label: "Success Rate" }
      ].map((stat, i) => (
        <CountUp key={i} {...stat} />
      ))}
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="contact-section container py-24">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6 font-heading">Get in Touch</h2>
        <p className="text-gray-500 text-lg mb-10">
          Have questions about your health or our services? Our dedicated support team is here to help you every step of the way.
        </p>
        
        <div className="space-y-6">
          {[
            { icon: <Phone size={20} />, title: "Call Us Directly", info: "+91 000-000-0000", action: "Call Now" },
            { icon: <MessageSquare size={20} />, title: "WhatsApp Us", info: "Instant reply for queries", action: "Chat Now" },
            { icon: <MapPin size={20} />, title: "Main Clinic", info: "Mecheda, West Bengal", action: "Get Directions" }
          ].map((item, i) => (
            <div key={i} className="flex items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center mr-6">
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.info}</p>
              </div>
              <button className="text-primary font-bold text-sm hover:underline">{item.action}</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 -mr-32 -mt-32 rounded-full blur-3xl"></div>
        <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors" />
          <input type="email" placeholder="Email Address" className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors" />
          <textarea placeholder="How can we help?" rows="4" className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"></textarea>
          <button className="w-full bg-primary py-4 rounded-2xl font-bold hover:bg-primary-dark transition-colors">Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer bg-gray-900 text-white pt-24 pb-12 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-20" />
    <div className="container relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter font-heading uppercase">
              Doctor <span className="text-primary">3D</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
            Providing high-quality medical care with a focus on digestive health. Our team of specialists is dedicated to your well-being.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Linkedin', 'Facebook'].map((social) => (
              <motion.a 
                key={social}
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/5"
                whileHover={{ y: -5, scale: 1.1 }}
              >
                <div className="w-5 h-5 opacity-70 hover:opacity-100" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 font-heading">Quick Links</h4>
          <ul className="space-y-4">
            {['About Us', 'Our Services', 'Booking', 'Contact'].map((link) => (
              <li key={link}>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                  <span className="w-0 h-0.5 bg-primary mr-0 group-hover:w-2 group-hover:mr-2 transition-all" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 font-heading">Contact Info</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-white/5">
                <MapPin size={20} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                123 Medical Avenue,<br />
                Kolkata, West Bengal
              </p>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-white/5">
                <Phone size={20} />
              </div>
              <p className="text-gray-400 text-sm font-semibold">+91 98765 43210</p>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-white/5">
                <Mail size={20} />
              </div>
              <p className="text-gray-400 text-sm">contact@doctor3d.in</p>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-8 font-heading">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-6">Stay updated with latest health tips and clinic news.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button className="btn btn-solid w-full !py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        <p>© 2026 Doctor 3D Medical Clinic. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="app">
      <CustomCursor />
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <Navbar />
      <HeroSection />
      <FeatureBanner />
      <StatsSection />
      <ExpertiseSection />
      <section id="booking" className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-heading">Book Your Visit</h2>
            <p className="text-slate-500 mt-4 text-lg">Secure your preferred time slot in minutes</p>
          </motion.div>
          <BookingSystem />
        </div>
      </section>
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
