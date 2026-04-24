'use client';

import { useState } from 'react';
import { Mail, MapPin, Clock, ArrowRight, Menu, X } from 'lucide-react';

// ============================================================================
// SVG Components
// ============================================================================

const AgaveMark = () => (
  <svg
    viewBox="0 0 48 48"
    className="w-8 h-8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="agaveMark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4c8" />
        <stop offset="100%" stopColor="#d4a035" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" stroke="url(#agaveMark)" strokeWidth="2" />
    <path
      d="M24 10 L28 20 L24 24 L20 20 Z"
      fill="url(#agaveMark)"
      opacity="0.8"
    />
    <path
      d="M24 38 L28 28 L24 24 L20 28 Z"
      fill="url(#agaveMark)"
      opacity="0.6"
    />
  </svg>
);

const HeroDiagramSVG = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="heroDot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00d4c8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#00d4c8" stopOpacity="0.1" />
      </radialGradient>
      <filter id="heroGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Center rosette */}
    <circle cx="200" cy="200" r="80" fill="url(#heroDot)" filter="url(#heroGlow)" />

    {/* Six leaves radiating outward */}
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Top */}
      <path
        d="M 200 200 Q 190 120 200 80"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      {/* Top-right */}
      <path
        d="M 200 200 Q 250 120 280 80"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      {/* Bottom-right */}
      <path
        d="M 200 200 Q 260 260 300 320"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      {/* Bottom */}
      <path
        d="M 200 200 Q 200 280 200 320"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      {/* Bottom-left */}
      <path
        d="M 200 200 Q 140 260 100 320"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      {/* Top-left */}
      <path
        d="M 200 200 Q 150 120 120 80"
        stroke="#00d4c8"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </g>

    {/* Accent dots */}
    <circle cx="200" cy="100" r="4" fill="#d4a035" opacity="0.7" />
    <circle cx="280" cy="100" r="4" fill="#d4a035" opacity="0.6" />
    <circle cx="310" cy="310" r="4" fill="#d4a035" opacity="0.6" />
    <circle cx="200" cy="320" r="4" fill="#d4a035" opacity="0.7" />
    <circle cx="90" cy="310" r="4" fill="#d4a035" opacity="0.6" />
    <circle cx="120" cy="100" r="4" fill="#d4a035" opacity="0.6" />
  </svg>
);

const BeatitudeWheelSVG = ({ activePhase }) => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4c8" />
        <stop offset="100%" stopColor="#d4a035" />
      </linearGradient>
    </defs>

    {/* Outer circle */}
    <circle
      cx="200"
      cy="200"
      r="180"
      fill="none"
      stroke="#00d4c8"
      strokeWidth="2"
      opacity="0.3"
    />

    {/* 5 segments */}
    {[0, 1, 2, 3, 4].map((i) => {
      const angle = (i * 72 * Math.PI) / 180;
      const x = 200 + 140 * Math.cos(angle);
      const y = 200 + 140 * Math.sin(angle);
      const isActive = i === activePhase;

      return (
        <g key={i}>
          {/* Spoke */}
          <line
            x1="200"
            y1="200"
            x2={x}
            y2={y}
            stroke={isActive ? "#00d4c8" : "#d4a035"}
            strokeWidth={isActive ? "3" : "2"}
            opacity={isActive ? "1" : "0.4"}
          />
          {/* Node */}
          <circle
            cx={x}
            cy={y}
            r={isActive ? "10" : "6"}
            fill={isActive ? "#00d4c8" : "#d4a035"}
            opacity={isActive ? "1" : "0.5"}
          />
        </g>
      );
    })}

    {/* Center dot */}
    <circle cx="200" cy="200" r="8" fill="url(#wheelGrad)" />
  </svg>
);

const ServiceIcon = ({ type }) => {
  const iconProps = { className: 'w-6 h-6' };

  const icons = {
    strategy: <ArrowRight {...iconProps} />,
    systems: <Mail {...iconProps} />,
    scale: <MapPin {...iconProps} />,
    operationalize: <Clock {...iconProps} />,
    enable: <ArrowRight {...iconProps} />,
    evolve: <Mail {...iconProps} />,
  };

  return icons[type] || <ArrowRight {...iconProps} />;
};

// ============================================================================
// Navbar Component
// ============================================================================

const Navbar = ({ onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Services', target: 'services' },
    { label: 'Why Agavi', target: 'why' },
    { label: 'Process', target: 'beatitude' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleNavClick = (target) => {
    onNavClick(target);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#070c14] border-b border-[#00d4c8]/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavClick('hero')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <AgaveMark />
          <span className="text-white font-semibold hidden sm:inline">
            Agavi
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="text-[#ffffff99] hover:text-[#00d4c8] transition-colors text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden bg-[#0a0f1a] border-t border-[#00d4c8]/10 transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="text-[#ffffff99] hover:text-[#00d4c8] transition-colors text-sm text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ============================================================================
// Hero Component
// ============================================================================

const Hero = ({ onCtaClick }) => {
  const departments = [
    'CRM',
    'Finance',
    'Sales',
    'Operations',
    'Customer Service',
    'Marketing',
  ];

  return (
    <section
      id="hero"
      className="min-h-screen bg-[#070c14] pt-24 pb-12 px-6 flex items-center animate-fade-in"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Enterprise Transformation,{' '}
              <span className="text-[#00d4c8]">Not Software</span>
            </h1>
            <p className="text-lg text-[#ffffff99] mb-8 leading-relaxed">
              We embed strategy into your systems. We scale what works. We evolve
              how you compete.
            </p>
            <button
              onClick={onCtaClick}
              className="px-8 py-3 bg-[#00d4c8] text-[#070c14] font-semibold rounded-lg hover:bg-[#00d4c8]/90 transition-colors"
            >
              Start the Journey
            </button>
          </div>

          {/* Right Diagram */}
          <div className="relative">
            <div className="aspect-square">
              <HeroDiagramSVG />
            </div>

            {/* Department Labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              {departments.map((dept, i) => {
                const angle = (i * 360) / departments.length;
                const radius = 45;
                const x =
                  50 + radius * Math.cos((angle * Math.PI) / 180) / 1.2;
                const y =
                  50 + radius * Math.sin((angle * Math.PI) / 180) / 1.2;

                return (
                  <div
                    key={dept}
                    className="absolute px-3 py-1 bg-[#00d4c8]/10 border border-[#00d4c8]/30 rounded-full text-xs text-[#00d4c8] font-medium whitespace-nowrap animate-fade-in"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${0.6 + i * 0.05}s`,
                    }}
                  >
                    {dept}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Statement Component
// ============================================================================

const Statement = () => {
  const pillars = [
    { title: 'Strategy', description: 'Define the path forward' },
    { title: 'Systems', description: 'Build scalable operations' },
    { title: 'Scale', description: 'Grow with confidence' },
  ];

  return (
    <section className="bg-[#0a0f1a] py-20 px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          We don't sell software.
          <br />
          <span className="text-[#00d4c8]">We architect transformation.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="bg-[#070c14] border border-[#00d4c8]/20 rounded-lg p-8 hover:border-[#00d4c8] hover:border-opacity-100 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-2xl font-bold text-[#00d4c8] mb-3">
                {pillar.title}
              </h3>
              <p className="text-[#ffffff99]">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Services Component
// ============================================================================

const Services = () => {
  const services = [
    {
      id: 'strategy',
      title: 'Strategic Roadmapping',
      description: 'Align your vision with operational reality',
      icon: 'strategy',
    },
    {
      id: 'systems',
      title: 'Systems Architecture',
      description: 'Design scalable, integrated operations',
      icon: 'systems',
    },
    {
      id: 'scale',
      title: 'Growth Acceleration',
      description: 'Scale revenue and operations in parallel',
      icon: 'scale',
    },
    {
      id: 'operationalize',
      title: 'Process Operationalization',
      description: 'Turn strategy into day-to-day execution',
      icon: 'operationalize',
    },
    {
      id: 'enable',
      title: 'Team Enablement',
      description: 'Build capability across your organization',
      icon: 'enable',
    },
    {
      id: 'evolve',
      title: 'Continuous Evolution',
      description: 'Adapt and improve as markets shift',
      icon: 'evolve',
    },
  ];

  return (
    <section id="services" className="bg-[#070c14] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center animate-fade-in">
          Our Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="bg-[#0a0f1a] border border-[#00d4c8]/10 rounded-lg p-8 group cursor-pointer hover:border-[#00d4c8] hover:bg-[#0f141f] transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="text-[#d4a035] mb-4">
                <ServiceIcon type={service.icon} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-[#ffffff99] mb-4">{service.description}</p>
              <div className="inline-flex items-center gap-2 text-[#00d4c8] text-sm font-medium group-hover:gap-3 transition-all">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Beatitude Component (5-Phase Process)
// ============================================================================

const Beatitude = () => {
  const phases = [
    {
      num: 1,
      title: 'Assess',
      description: 'Understand your current state and opportunity',
    },
    {
      num: 2,
      title: 'Design',
      description: 'Create a tailored transformation blueprint',
    },
    {
      num: 3,
      title: 'Build',
      description: 'Implement systems and processes systematically',
    },
    {
      num: 4,
      title: 'Operationalize',
      description: 'Embed transformation into daily operations',
    },
    {
      num: 5,
      title: 'Evolve',
      description: 'Continuously improve and adapt',
    },
  ];

  const [activePhase, setActivePhase] = useState(0);

  return (
    <section id="beatitude" className="bg-[#0a0f1a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center animate-fade-in">
          Our Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Phase List */}
          <div className="space-y-4 animate-fade-in">
            {phases.map((phase, i) => (
              <button
                key={phase.num}
                onClick={() => setActivePhase(i)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  activePhase === i
                    ? 'bg-[#00d4c8]/10 border-[#00d4c8] text-white'
                    : 'bg-[#070c14] border-[#00d4c8]/20 text-[#ffffff99] hover:border-[#00d4c8]/50'
                }`}
              >
                <div className="font-bold text-[#00d4c8] mb-1">
                  Phase {phase.num}
                </div>
                <div className="font-semibold mb-1">{phase.title}</div>
                <div className="text-sm">{phase.description}</div>
              </button>
            ))}
          </div>

          {/* Beatitude Wheel */}
          <div className="hidden md:block animate-fade-in">
            <BeatitudeWheelSVG activePhase={activePhase} />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Why Component
// ============================================================================

const Why = () => {
  const reasons = [
    {
      title: 'Proven Framework',
      description: 'Built from real transformation experience',
    },
    {
      title: 'End-to-End Ownership',
      description: 'We see it through from strategy to execution',
    },
    {
      title: 'Team Enablement',
      description: 'Your team becomes the change agent',
    },
    {
      title: 'Measurable Results',
      description: 'Track progress and impact continuously',
    },
  ];

  return (
    <section id="why" className="bg-[#070c14] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center animate-fade-in">
          Why Choose Agavi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="bg-[#0a0f1a] border border-[#d4a035]/20 rounded-lg p-8 hover:border-[#d4a035] hover:border-opacity-100 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-2xl font-bold text-[#d4a035] mb-3">
                {reason.title}
              </h3>
              <p className="text-[#ffffff99]">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// CTA Section
// ============================================================================

const CTASection = ({ onCtaClick }) => {
  return (
    <section className="bg-[#0a0f1a] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative p-12 rounded-lg border-2 border-transparent bg-[#070c14] overflow-hidden animate-fade-in"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #070c14, #070c14), linear-gradient(135deg, #00d4c8, #d4a035)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform?
            </h2>
            <p className="text-[#ffffff99] mb-8">
              Let's discuss how Agavi can architect your growth and scale your
              impact.
            </p>
            <button
              onClick={onCtaClick}
              className="px-8 py-3 bg-[#00d4c8] text-[#070c14] font-semibold rounded-lg hover:bg-[#00d4c8]/90 transition-colors"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Contact Component
// ============================================================================

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    interest: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        company: formData.company,
        email: formData.email,
        phone: '',
        message: `${formData.message}\n\nInterest: ${formData.interest}`,
      };

      const response = await fetch(
        'https://agaviwebsite.jay-messamore.workers.dev/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          interest: '',
          message: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@agavi.io',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
    },
  ];

  return (
    <section id="contact" className="bg-[#070c14] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center animate-fade-in">
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in">
            {contactInfo.map((info, i) => (
              <div key={info.label} className="flex gap-4">
                <div className="text-[#00d4c8] flex-shrink-0">
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-[#ffffff66] mb-1">
                    {info.label}
                  </div>
                  <div className="text-white font-medium">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 animate-fade-in"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white placeholder-[#ffffff33] focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8]"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
                className="bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white placeholder-[#ffffff33] focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8]"
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white placeholder-[#ffffff33] focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8]"
            />

            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white placeholder-[#ffffff33] focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8]"
            />

            <select
              value={formData.interest}
              onChange={(e) =>
                setFormData({ ...formData, interest: e.target.value })
              }
              className="w-full bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8]"
            >
              <option value="">Select area of interest</option>
              <option value="Strategic Roadmapping">
                Strategic Roadmapping
              </option>
              <option value="Systems Architecture">Systems Architecture</option>
              <option value="Growth Acceleration">Growth Acceleration</option>
              <option value="Process Operationalization">
                Process Operationalization
              </option>
              <option value="Team Enablement">Team Enablement</option>
              <option value="Continuous Evolution">Continuous Evolution</option>
            </select>

            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full bg-[#0a0f1a] border border-[#00d4c8]/20 rounded-lg px-4 py-3 text-white placeholder-[#ffffff33] focus:outline-none focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] resize-none"
            />

            {submitStatus === 'success' && (
              <div className="bg-[#00d4c8]/10 border border-[#00d4c8] rounded-lg p-3 text-[#00d4c8] text-sm">
                Thanks for reaching out! We'll be in touch shortly.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 bg-[#00d4c8] text-[#070c14] font-semibold rounded-lg hover:bg-[#00d4c8]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Footer Component
// ============================================================================

const Footer = ({ onNavClick }) => {
  const footerSections = [
    {
      title: 'Services',
      links: [
        'Strategic Roadmapping',
        'Systems Architecture',
        'Growth Acceleration',
      ],
    },
    {
      title: 'Company',
      links: ['About', 'Process', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Blog', 'Case Studies', 'Insights'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies'],
    },
  ];

  return (
    <footer className="bg-[#0a0f1a] border-t border-[#00d4c8]/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === 'Contact') onNavClick('contact');
                        if (link === 'Process') onNavClick('beatitude');
                      }}
                      className="text-[#ffffff99] hover:text-[#00d4c8] transition-colors text-sm"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#00d4c8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={() => onNavClick('hero')}
            className="flex items-center gap-2 text-white hover:text-[#00d4c8] transition-colors"
          >
            <AgaveMark />
            <span className="font-semibold">Agavi</span>
          </button>
          <p className="text-[#ffffff66] text-sm">
            © 2024 Agavi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// Main App Component
// ============================================================================

export default function Home() {
  const scrollToSection = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#070c14] text-white min-h-screen">
      <Navbar onNavClick={scrollToSection} />
      <Hero onCtaClick={() => scrollToSection('contact')} />
      <Statement />
      <Services />
      <Beatitude />
      <Why />
      <CTASection onCtaClick={() => scrollToSection('contact')} />
      <Contact />
      <Footer onNavClick={scrollToSection} />
    </div>
  );
}
