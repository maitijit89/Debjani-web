import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll } from 'framer-motion';
import { 
  Stethoscope, Phone, Calendar, Baby, Flower2, Activity, Thermometer, 
  HeartPulse, Brain, UserRound, ShieldPlus, Globe, Camera, Link, 
  MapPin, MessageSquare, Menu, X, ChevronRight, Award, Users, 
  Clock3, Map, Heart, Mail, ArrowRight, Sparkles, Star,
  Share2
} from 'lucide-react';
import './App.css';
import stomachImg from './assets/stomach.png';
import BookingSystem from './components/BookingSystem';

const CustomCursor = () => null;

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
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Heart size={20} fill="currentColor" className="md:w-6 md:h-6" />
          </div>
          <div>
            <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 block leading-none uppercase">
              S.S. SK. SN <span className="text-primary">Clinic</span>
            </span>
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 tracking-[0.2em] md:tracking-[0.3em] uppercase">Precision Genetic Homeopathy</span>
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
              className="btn btn-solid !py-3 !px-8 !text-xs uppercase tracking-widest !w-auto"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Now
            </button>
          </Magnetic>
        </div>

        <button className="lg:hidden text-slate-900 p-2 -mr-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[99] lg:hidden flex flex-col items-center justify-center gap-8 p-10"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <button 
              className="absolute top-6 right-6 text-slate-900 p-2"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} />
            </button>
            {navLinks.map((item) => (
              <motion.a 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className="text-4xl font-black text-gray-900 uppercase tracking-tighter hover:text-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.name}
              </motion.a>
            ))}
            <button 
              className="btn btn-solid mt-4 !w-full max-w-xs"
              onClick={() => {
                setIsOpen(false);
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book Appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <section className="container pt-32 md:pt-48 pb-20 md:pb-32">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-24 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 md:space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 text-primary font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-lg"
          >
            <Sparkles size={16} className="text-primary-glow animate-pulse" />
            Leading Genetic Real Homeopathy
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Heal your gut, <br />
            <span>restore your life.</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Experience precision digestive care with Dr. Debjani Maity. We combine modern genetic insight with classical homeopathy for lasting wellness.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Magnetic>
              <button 
                className="btn btn-solid !px-10 !py-5 shadow-2xl"
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Consultation
                <ArrowRight size={20} />
              </button>
            </Magnetic>
            <Magnetic>
              <button 
                className="btn btn-outline !px-10 !py-5"
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Go for Online Consultation
              </button>
            </Magnetic>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.img 
                  key={i} 
                  src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white shadow-xl"
                  alt="User"
                  whileHover={{ y: -10, scale: 1.1, zIndex: 10 }}
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" className="md:w-4 md:h-4" />)}
              </div>
              <p className="text-slate-900 font-black text-[10px] md:text-sm uppercase tracking-widest">10,000+ Success Stories</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="relative hidden lg:block parallax-container"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring" }}
        >
          <div className="liquid-glass p-12 relative z-10 parallax-img overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
            <img src={stomachImg} alt="Health" className="w-full h-auto drop-shadow-[0_35px_35px_rgba(14,165,233,0.3)]" />
          </div>
          <div className="absolute -inset-20 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};

const StatsSection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {[
          { number: "10k+", label: "Happy Patients", icon: <Users size={32} /> },
          { number: "15+", label: "Years Experience", icon: <Award size={32} /> },
          { number: "24/7", label: "Care Support", icon: <Clock3 size={32} /> },
          { number: "99%", label: "Success Rate", icon: <Activity size={32} /> }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className="text-center space-y-4 px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-3xl flex items-center justify-center text-primary mx-auto shadow-xl liquid-glass border-none">
              {stat.icon}
            </div>
            <span className="stats-number">{stat.number}</span>
            <span className="stats-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeatureBanner = () => (
  <section id="specializations" className="container py-32">
    <motion.div 
      className="bg-slate-950 rounded-[60px] p-16 md:p-24 overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full -ml-48 -mb-48 blur-[100px]" />
      
      <div className="relative z-10 grid lg:grid-cols-[1fr_0.8fr] gap-24 items-center">
        <div className="space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Advanced digestive care <br />
            <span className="text-primary-glow">rooted in genetics.</span>
          </h2>
          <p className="text-slate-400 text-xl leading-relaxed max-w-xl font-medium">
            S.S. SK. SN Clinic integrates modern genetic mapping with classical homeopathy to deliver personalized, side-effect-free treatments for your entire family.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em]">
              <ShieldPlus size={24} className="text-primary-glow" />
              Safe & Natural
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em]">
              <Brain size={24} className="text-primary-glow" />
              Genetic Insight
            </div>
          </div>
        </div>
        
        <div className="grid gap-8">
          {[
            { icon: <Stethoscope size={32} />, title: "Gut Wellness", text: "Targeted care for IBS, acidity, and chronic gastric issues." },
            { icon: <HeartPulse size={32} />, title: "Family Health", text: "Gentle homeopathic solutions for all ages, from infants to seniors." }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 group hover:bg-white/10 transition-all cursor-pointer flex flex-col items-start"
              whileHover={{ x: 20 }}
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="text-primary-glow mb-8 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center">{item.icon}</div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">{item.text}</p>
              <button className="btn btn-solid !py-3 !text-[10px] !px-8 mt-auto group-hover:bg-primary-glow group-hover:text-slate-950 transition-all">
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

const ExpertiseSection = () => {
  const services = [
    { icon: <Stethoscope size={28} />, title: "Digestive Care", desc: "Expert treatment for chronic acidity, bloating, and stomach pain." },
    { icon: <HeartPulse size={28} />, title: "Genetic Insight", desc: "Personalized healing guided by your unique hereditary patterns." },
    { icon: <Baby size={28} />, title: "Pediatric Care", desc: "Gentle homeopathic solutions for children's health and immunity." },
    { icon: <Thermometer size={28} />, title: "Metabolic Health", desc: "Support for thyroid, blood sugar, and metabolic wellness." },
    { icon: <Brain size={28} />, title: "Gut-Brain Link", desc: "Integrated care for stress-related digestive and mood issues." },
    { icon: <ShieldPlus size={28} />, title: "Immunity Boost", desc: "Natural protocols to strengthen your body's defense system." }
  ];

  return (
    <section id="services" className="container py-32">
      <div className="text-center mb-24">
        <h2 className="section-title">Specialized Services</h2>
        <p className="section-subtitle">Comprehensive care tailored to your unique health needs.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => (
          <motion.div 
            key={i} 
            className="card-glass group flex flex-col items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700">
              {service.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">{service.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">{service.desc}</p>
            <button className="btn btn-solid !py-4 !text-[10px] w-full mt-auto">
              Book Appointment
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => (
  <section id="contact" className="container py-20 md:py-32">
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24 items-center">
      <div className="space-y-12 md:space-y-16">
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="section-title lg:text-left">Get in Touch</h2>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">Have questions? Our team is here to help you on your journey to wellness.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {[
            { icon: <Phone size={24} />, title: "Call Us", info: "+91 98765 43210" },
            { icon: <Mail size={24} />, title: "Email Us", info: "contact@sskssnclinic.in" },
            { icon: <MessageSquare size={24} />, title: "WhatsApp", info: "Instant Chat" },
            { icon: <MapPin size={24} />, title: "Locations", info: "West Bengal, India" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="space-y-4 group cursor-pointer flex flex-col items-center lg:items-start"
              whileHover={{ x: 10 }}
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl liquid-glass border-none">
                {item.icon}
              </div>
              <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{item.info}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="card-glass !p-8 md:!p-16 relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 md:mb-10 tracking-tighter uppercase text-center lg:text-left">Send a Message</h3>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-6">
            <input type="text" placeholder="Name" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400" />
            <input type="email" placeholder="Email" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400" />
          </div>
          <textarea rows="5" placeholder="How can we help you today?" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-8 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold placeholder:text-slate-400 resize-none"></textarea>
          <Magnetic>
            <button className="btn btn-solid w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl !w-full">
              Send Message
            </button>
          </Magnetic>
        </form>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 text-white pt-32 pb-16 overflow-hidden relative">
    <div className="container">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart size={28} fill="currentColor" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase">S.S. SK. SN</span>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Precision healing through modern genetic homeopathy. Your journey to wellness begins with scientific care.
          </p>
          <div className="flex gap-6">
            {[<Share2 size={22} />, <MessageSquare size={22} />].map((icon, i) => (
              <motion.a 
                key={i} 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all border border-white/10"
                whileHover={{ y: -10, rotate: 15 }}
              >
                {icon}
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
          <div className="space-y-4">
            <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-sm font-bold focus:outline-none focus:border-primary-glow transition-all" />
            <button className="btn btn-solid w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">
        <p>© 2026 S.S. SK. SN CLINIC. SCIENTIFIC HEALING.</p>
        <div className="flex gap-12">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="app">
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
    </div>
  );
}

export default App;
