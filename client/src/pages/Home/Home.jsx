import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import doctorHeroImg from '../../assets/images/doctor_hero.png';
import './Home.css';

/* ═══════════════════════════════════════════════════════════
   3D CARD WRAPPER
   – Mouse-move: perspective tilt (rotateX / rotateY)
   – Mouse-down: press-in (scale + translateZ)
   – Mouse-up / leave: spring back
   – Click: ripple burst from click position
   ═══════════════════════════════════════════════════════════ */
const Card3D = ({ children, className = '', style = {}, as: Tag = 'div', to, onClick }) => {
  const cardRef = useRef(null);

  const spawnRipple = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'card3d-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, []);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);   // –1 … +1
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY =  dx * 14;   // max 14° left/right
    const rotX = -dy * 10;   // max 10° up/down
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    card.style.transition = 'transform 0.08s ease-out';
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.style.transition = 'transform 0.45s cubic-bezier(.23,1.1,.7,1)';
  }, []);

  const onMouseDown = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(700px) scale(0.96) translateZ(-4px)';
    card.style.transition = 'transform 0.1s ease';
    spawnRipple(e);
  }, [spawnRipple]);

  const onMouseUp = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(700px) translateZ(6px)';
    card.style.transition = 'transform 0.18s ease-out';
  }, []);

  const commonProps = {
    ref: cardRef,
    className: `card3d ${className}`,
    style,
    onMouseMove,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onClick,
  };

  if (to) {
    return <Link to={to} {...commonProps}>{children}</Link>;
  }
  return <Tag {...commonProps}>{children}</Tag>;
};

/* ─── Data ────────────────────────────────────────────────── */
const SPECIALTIES = [
  { icon: '❤️', name: 'Cardiology',    desc: 'Heart & Blood Vessels' },
  { icon: '🧠', name: 'Neurology',     desc: 'Brain & Nervous System' },
  { icon: '🦴', name: 'Orthopedics',   desc: 'Bones & Joints' },
  { icon: '🧒', name: 'Pediatrics',    desc: "Children's Health" },
  { icon: '👁️', name: 'Ophthalmology', desc: 'Eye Care' },
  { icon: '🦷', name: 'Dentistry',     desc: 'Oral Health' },
  { icon: '🩺', name: 'General',       desc: 'Primary Care' },
  { icon: '🌸', name: 'Dermatology',   desc: 'Skin & Hair' },
];

const STEPS = [
  { step: '01', icon: '🔍', title: 'Find a Doctor',    desc: 'Search from 500+ verified doctors by specialty, location or name.', link: '/doctors' },
  { step: '02', icon: '📅', title: 'Book a Slot',      desc: 'Pick a convenient date and time slot in just a few clicks.' },
  { step: '03', icon: '✅', title: 'Get Confirmation', desc: 'Receive instant confirmation and appointment reminders.' },
  { step: '04', icon: '🩺', title: 'Visit the Doctor', desc: 'Attend your appointment with all your reports ready.' },
];

const STATS = [
  { number: '500+', label: 'Verified Doctors' },
  { number: '50K+', label: 'Happy Patients'   },
  { number: '30+',  label: 'Specialties'      },
  { number: '4.9★', label: 'Average Rating'   },
];

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */
const Home = () => (
  <div className="home">
    {/* ── HERO ── */}
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
      <div className="container hero-inner">
        <div className="hero-content animate-fadeInUp">
          <span className="hero-badge">🏥 Trusted Healthcare Platform</span>
          <h1>Book Your Doctor<br /><span className="gradient-text">Appointment Online</span></h1>
          <p className="hero-desc">
            Connect with the best doctors across all specialties. Get expert medical care
            from the comfort of your home — quickly, easily, and reliably.
          </p>
          <div className="hero-actions">
            <Link to="/doctors" className="btn btn-primary btn-lg">Find a Doctor →</Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Sign Up Free</Link>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              {['👨‍⚕️','👩‍⚕️','👨‍⚕️','👩‍⚕️'].map((e, i) => (
                <span key={i} className="trust-avatar">{e}</span>
              ))}
            </div>
            <p><strong>50,000+</strong> patients trust us</p>
          </div>
        </div>
        <div className="hero-visual animate-fadeIn">
          <div className="hero-card-float hero-card-1">
            <span>🗓️</span>
            <div><strong>Next Available</strong><p>Today 2:00 PM</p></div>
          </div>
          <div className="hero-illustration">
            <img src={doctorHeroImg} alt="Doctor with Stethoscope" className="hero-doctor-img" />
          </div>
          <div className="hero-card-float hero-card-2">
            <span>⭐</span>
            <div><strong>4.9 / 5 Rating</strong><p>From 10k+ reviews</p></div>
          </div>
        </div>
      </div>
    </section>

    {/* ── STATS ── */}
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── SPECIALTIES ── */}
    <section className="specialties-section section">
      <div className="container">
        <div className="section-title">
          <span className="badge">Browse by Specialty</span>
          <h2>Find the Right Specialist</h2>
          <p>Access top doctors across all medical specialties, available near you</p>
        </div>
        <div className="specialties-grid">
          {SPECIALTIES.map((s, i) => (
            <Card3D
              key={i}
              to={`/doctors?specialty=${s.name}`}
              className="specialty-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="specialty-icon">{s.icon}</div>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </Card3D>
          ))}
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ── */}
    <section className="how-section section">
      <div className="container">
        <div className="section-title">
          <span className="badge">Simple Process</span>
          <h2>How It Works</h2>
          <p>Book your appointment in 4 easy steps</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <Card3D
              key={i}
              to={s.link || undefined}
              className={`step-card ${s.link ? 'step-card--clickable' : ''} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {s.link && <span className="step-card-cta">Explore →</span>}
            </Card3D>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="cta-section section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Ready to See a Doctor?</h2>
            <p>Join thousands of patients who trust BookADoctor for their healthcare needs.</p>
            <div className="cta-actions">
              <Link to="/doctors" className="btn btn-primary btn-lg">Book Appointment</Link>
              <Link to="/register" className="btn btn-secondary btn-lg">Create Free Account</Link>
            </div>
          </div>
          <div className="cta-emoji">🏥</div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
