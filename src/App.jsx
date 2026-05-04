import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Phone, 
  Calendar, 
  Baby, 
  Flower2, 
  Activity, 
  Thermometer, 
  HeartPulse, 
  Brain, 
  UserRound, 
  ShieldPlus,
  Globe,
  Camera,
  Link,
  MapPin,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Award,
  Users,
  Clock3,
  Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import stomachImg from './assets/stomach.png';
import logoImg from './assets/logo.png';
import BookingSystem from './components/BookingSystem';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img src={logoImg} alt="Doctor 3D Logo" className="logo-img" />
          Doctor 3D
        </motion.div>
        
        <div className="nav-links">
          {['Services', 'Specializations', 'About', 'Contact'].map((item, i) => (
            <motion.a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <div className="nav-ctas">
          <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="btn-text">WhatsApp Consult</a>
          <button 
            className="btn btn-solid"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Appointment
          </button>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
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
    </nav>
  );
};

const HeroSection = () => (
  <section className="hero container">
    <div className="hero-content">
      <motion.div 
        className="hero-tag"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserRound size={14} />
        Dr. Debjani Maity
      </motion.div>
      
      <motion.h1 
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        A healthy stomach means a <span>healthy mind</span>
      </motion.h1>
      
      <motion.p 
        className="hero-desc"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Experience a new dimension of clinical care with Doctor 3D. We combine high-tech medical precision with deep human empathy for comprehensive healing.
      </motion.p>
      
      <motion.div 
        className="hero-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <button 
          className="btn btn-solid"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Calendar size={18} />
          Book Physical Checkup
        </button>
        <button className="btn btn-outline">
          <Phone size={18} />
          Video Consultation
        </button>
      </motion.div>
    </div>

    <motion.div 
      className="hero-image-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <motion.div 
        className="hero-card"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={stomachImg} alt="3D Stomach Illustration" className="hero-image" />
        <motion.div 
          className="hero-overlay-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="overlay-status">
            <span className="status-dot"></span>
            Live Diagnostics
          </div>
          <div className="overlay-text">
            Visualizing recovery through 3D mapping technology.
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </section>
);

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
  <section className="stats-section container py-20">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
      {[
        { icon: <Users className="text-primary" />, value: "10k+", label: "Happy Patients" },
        { icon: <Award className="text-primary" />, value: "15+", label: "Years Experience" },
        { icon: <Clock3 className="text-primary" />, value: "24/7", label: "Emergency Support" },
        { icon: <Activity className="text-primary" />, value: "99%", label: "Success Rate" }
      ].map((stat, i) => (
        <motion.div 
          key={i}
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
        </motion.div>
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
  <footer id="contact" className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <img src={logoImg} alt="Doctor 3D Logo" className="logo-img" />
            Doctor 3D
          </div>
          <p className="footer-desc">
            © 2026 Dr. Debjani Maity (Doctor 3D). High-tech healing with human empathy. Bringing world-class medical expertise to your doorstep.
          </p>
        </div>
        <div className="footer-col" id="about">
          <h4>Patient Care</h4>
          <ul>
            <li><a href="#">Patient Rights</a></li>
            <li><a href="#">Emergency Contact</a></li>
            <li><a href="#">Book Online</a></li>
            <li><a href="#">Support Center</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Specializations</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <div className="socials">
            <a href="#" className="social-icon"><Phone size={18} /></a>
            <a href="#" className="social-icon"><MessageSquare size={18} /></a>
            <a href="#" className="social-icon"><MapPin size={18} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">Designed for medical excellence & digital health.</p>
        <div className="socials">
          <a href="#" className="social-icon"><Camera size={18} /></a>
          <a href="#" className="social-icon"><Link size={18} /></a>
          <a href="#" className="social-icon"><Globe size={18} /></a>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="app">
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
