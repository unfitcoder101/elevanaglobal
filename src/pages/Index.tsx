import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import ContactModal from '@/components/ContactModal';
import CustomizationModal from '@/components/CustomizationModal';
import ChatBot from '@/components/ChatBot';
import ServiceSelectionModal from '@/components/ServiceSelectionModal';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AnimatedCounter from '@/components/AnimatedCounter';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  Instagram, 
  CheckCircle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  const contactInfo = {
    email: 'hello@levra.co',
    phone: '+91 9166922448',
    instagram: 'https://www.instagram.com/levra.co'
  };

  useEffect(() => {
    const revealElements = () => {
      const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add('animate');
        }
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
      revealElements();
    };

    revealElements();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(contactInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
    toast({
      title: "Email copied",
      description: `${contactInfo.email} copied to clipboard`,
    });
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const services = [
    {
      title: 'Brand Identity',
      description: 'Craft a premium presence that commands attention and builds instant trust.',
      features: ['Visual Identity', 'Brand Strategy', 'Market Positioning']
    },
    {
      title: 'Digital Growth',
      description: 'Strategic systems that attract high-value clients while you focus on excellence.',
      features: ['Lead Generation', 'Conversion Optimization', 'Analytics']
    },
    {
      title: 'AI Automation',
      description: 'Intelligent workflows that handle complexity, giving you back your time.',
      features: ['Process Automation', 'AI Integration', 'Smart Scheduling']
    },
    {
      title: 'Web Development',
      description: 'Clean, fast, conversion-focused websites that reflect your elevated brand.',
      features: ['Custom Design', 'Performance', 'SEO Foundation']
    },
    {
      title: 'Content Strategy',
      description: 'Thoughtful content that speaks to your audience with clarity and purpose.',
      features: ['Content Planning', 'Social Management', 'Engagement']
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored strategies for unique challenges. Tell us what you need.',
      features: ['Consultation', 'Custom Development', 'Ongoing Support']
    }
  ];

  const testimonials = [
    {
      name: 'R.S.',
      title: 'Gym Owner',
      content: 'LEVRA simplified everything. Leads come in, clients book, I focus on training.'
    },
    {
      name: 'C.W.',
      title: 'Salon Director',
      content: 'Our bookings doubled. The system runs itself. Pure efficiency.'
    },
    {
      name: 'L.J.',
      title: 'Real Estate',
      content: 'Three qualified buyers from one campaign. They understand premium.'
    },
    {
      name: 'J.K.',
      title: 'Wellness Studio',
      content: 'Finally, a website and system that matches our level of service.'
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
            
            {/* Logo */}
            <a 
              href="#hero" 
              onClick={(e) => scrollToSection(e, 'hero')}
              className="text-2xl md:text-3xl font-light tracking-[0.4em] text-foreground cursor-pointer hover:text-accent transition-colors duration-300"
            >
              LEVRA
            </a>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-16">
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="premium-link text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300">Services</a>
              <a href="#results" onClick={(e) => scrollToSection(e, 'results')} className="premium-link text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300">Results</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="premium-link text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300">About</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="premium-link text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="hidden md:inline-flex">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="hidden md:inline-flex text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                  <Button variant="default" size="sm" onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')} className="hidden md:inline-flex">
                    Book a Call
                  </Button>
                </>
              )}
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:text-accent transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden bg-background border-t border-border transition-all duration-500 ease-out ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <nav className="container mx-auto px-6 py-10 flex flex-col space-y-8">
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-lg tracking-widest text-muted-foreground hover:text-foreground transition-colors">Services</a>
              <a href="#results" onClick={(e) => scrollToSection(e, 'results')} className="text-lg tracking-widest text-muted-foreground hover:text-foreground transition-colors">Results</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-lg tracking-widest text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-lg tracking-widest text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <div className="pt-6 space-y-4 border-t border-border">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}>
                      Sign In
                    </Button>
                    <Button variant="default" className="w-full" onClick={() => { window.open('https://calendly.com/elevanaglobal/30min', '_blank'); setMobileMenuOpen(false); }}>
                      Book a Call
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section - with parallax */}
        <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center pt-24 pb-20 relative overflow-hidden">
          {/* Subtle background elements */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          />
          
          <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
            
            <div className="reveal-up">
              <p className="text-xs md:text-sm tracking-[0.5em] text-muted-foreground mb-10 uppercase">
                Business Solutions & AI Agency
              </p>
            </div>
            
            <h1 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tight mb-10 leading-[0.95] reveal-up delay-100"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              Elevation<br />
              <span className="text-muted-foreground">made effortless.</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-light leading-relaxed reveal-up delay-200">
              We remove complexity from growth. Premium systems, intelligent automation, and strategic clarity for business owners who value their time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 reveal-up delay-300">
              <Button 
                variant="default" 
                size="xl" 
                onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
                className="group min-w-[240px]"
              >
                Start Your Upgrade
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => setServiceModalOpen(true)}
                className="min-w-[240px]"
              >
                Explore Solutions
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 text-sm text-muted-foreground reveal-up delay-400">
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent" />
                No long-term contracts
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent" />
                Results in 30 days
              </span>
              <span className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent" />
                Satisfaction guaranteed
              </span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 reveal-up delay-500">
            <div className="w-px h-16 bg-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-8 bg-foreground/30 animate-[slide-down_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="results" className="py-32 md:py-40 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-20 md:mb-28">
              <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase reveal-up">Results</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight reveal-up delay-100">
                Numbers that matter.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16 md:gap-20 max-w-5xl mx-auto">
              <div className="text-center reveal-up">
                <AnimatedCounter end={1500} duration={2500} label="Monthly Visitors Gained" />
              </div>
              <div className="text-center reveal-up delay-100">
                <AnimatedCounter end={345} duration={2500} label="New Bookings Created" />
              </div>
              <div className="text-center reveal-up delay-200">
                <AnimatedCounter end={52} duration={2500} label="Automations Deployed" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 md:py-24 bg-foreground text-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left reveal-left">
                <h3 className="text-2xl md:text-3xl font-extralight mb-3">Ready to elevate your business?</h3>
                <p className="text-background/60">Book a free strategy call. No pressure, just clarity.</p>
              </div>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
                className="border-background/20 text-background hover:bg-background hover:text-foreground reveal-right min-w-[200px]"
              >
                Book a Strategy Call
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 md:py-40">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-20 md:mb-28">
              <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase reveal-up">Services</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-8 reveal-up delay-100">
                What we do.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto reveal-up delay-200">
                Clean solutions for complex problems. Each service designed to elevate your business without adding stress.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <Card 
                  key={index} 
                  className="bg-card border-border hover-lift hover-glow reveal-up group"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-10 md:p-12">
                    <div className="w-10 h-px bg-accent mb-8 group-hover:w-16 transition-all duration-500" />
                    <h3 className="text-xl md:text-2xl font-light tracking-wide mb-4">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-accent mr-4" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-20 reveal-up">
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => setCustomizationModalOpen(true)}
                className="group"
              >
                Build With LEVRA
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 md:py-40 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase reveal-up">About</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight reveal-up delay-100">
                  LEVRA means elevation.
                </h2>
              </div>
              <div className="space-y-8 text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                <p className="reveal-up delay-200">
                  We exist to remove the friction between where you are and where you want to be. No fluff. No unnecessary complexity. Just clear, intelligent solutions that work.
                </p>
                <p className="reveal-up delay-300">
                  Our approach is simple: understand deeply, build precisely, deliver excellence. Every system we create is designed to give you back your time while growing your business.
                </p>
                <p className="text-foreground font-medium text-xl md:text-2xl reveal-up delay-400">
                  Quiet confidence. Luxury-grade clarity. Growth made effortless.
                </p>
              </div>
              
              {/* Values */}
              <div className="grid md:grid-cols-3 gap-12 mt-24">
                <div className="text-center reveal-up">
                  <div className="w-12 h-px bg-accent mx-auto mb-6" />
                  <h4 className="text-lg font-medium mb-3">Precision</h4>
                  <p className="text-muted-foreground text-sm">Every detail considered. Every element purposeful.</p>
                </div>
                <div className="text-center reveal-up delay-100">
                  <div className="w-12 h-px bg-accent mx-auto mb-6" />
                  <h4 className="text-lg font-medium mb-3">Simplicity</h4>
                  <p className="text-muted-foreground text-sm">Complexity removed. Clarity delivered.</p>
                </div>
                <div className="text-center reveal-up delay-200">
                  <div className="w-12 h-px bg-accent mx-auto mb-6" />
                  <h4 className="text-lg font-medium mb-3">Excellence</h4>
                  <p className="text-muted-foreground text-sm">Premium standards. Consistent results.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-32 md:py-40 bg-muted/20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-20 md:mb-28">
              <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase reveal-up">Testimonials</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight reveal-up delay-100">
                Client experiences.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="bg-card border-border hover-lift reveal-up"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-10 md:p-12">
                    <Sparkles className="w-5 h-5 text-accent mb-6" />
                    <p className="text-foreground text-lg md:text-xl mb-8 leading-relaxed font-light">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted flex items-center justify-center text-sm font-medium">
                        {testimonial.name}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 md:py-48 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase reveal-up">Get Started</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-8 reveal-up delay-100">
                Ready to elevate?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 reveal-up delay-200">
                Book a conversation. No pressure, no pitch—just a clear discussion about your goals and how we might help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-up delay-300">
                <Button 
                  variant="default" 
                  size="xl"
                  onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
                  className="group min-w-[240px]"
                >
                  Elevate My Business
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => setContactModalOpen(true)}
                  className="min-w-[240px]"
                >
                  Send a Message
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-16 md:py-20 bg-foreground text-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Brand Name */}
              <div className="text-center mb-10">
                <span className="text-2xl md:text-3xl font-light tracking-[0.5em] text-background">
                  LEVRA
                </span>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-10">
                <a href="#services" className="text-xs tracking-[0.2em] uppercase text-background/50 hover:text-background transition-colors duration-300">
                  Services
                </a>
                <a href="#process" className="text-xs tracking-[0.2em] uppercase text-background/50 hover:text-background transition-colors duration-300">
                  Process
                </a>
                <a href="#testimonials" className="text-xs tracking-[0.2em] uppercase text-background/50 hover:text-background transition-colors duration-300">
                  Results
                </a>
                <a href="#cta" className="text-xs tracking-[0.2em] uppercase text-background/50 hover:text-background transition-colors duration-300">
                  Contact
                </a>
              </nav>
              
              {/* Social Icons */}
              <div className="flex justify-center items-center gap-6 mb-10">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleEmailClick}
                      className="text-background/40 hover:text-accent transition-colors duration-300"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center space-x-2">
                      <span>{contactInfo.email}</span>
                      {copiedEmail && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => window.open(`tel:${contactInfo.phone}`, '_self')}
                      className="text-background/40 hover:text-accent transition-colors duration-300"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contactInfo.phone}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => window.open(contactInfo.instagram, '_blank')}
                      className="text-background/40 hover:text-accent transition-colors duration-300"
                    >
                      <Instagram className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>@levra.co</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Divider */}
              <div className="w-16 h-px bg-background/10 mx-auto mb-8"></div>
              
              {/* Bottom Section */}
              <div className="text-center space-y-3">
                <div className="flex justify-center items-center gap-6 text-[10px] tracking-[0.15em] uppercase text-background/30">
                  <a href="#" className="hover:text-background/50 transition-colors duration-300">Privacy</a>
                  <span className="text-background/20">·</span>
                  <a href="#" className="hover:text-background/50 transition-colors duration-300">Terms</a>
                </div>
                <p className="text-[10px] tracking-wider text-background/25">
                  © 2024 LEVRA · Crafted with intention
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating CTA */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              size="lg" 
              className="floating-cta"
              onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
            >
              <Phone className="w-4 h-4" />
              Book Call
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Schedule your free consultation</p>
          </TooltipContent>
        </Tooltip>

        {/* Modals */}
        <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
        <CustomizationModal isOpen={customizationModalOpen} onClose={() => setCustomizationModalOpen(false)} />
        <ServiceSelectionModal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} />
        <ChatBot />
      </div>
    </TooltipProvider>
  );
};

export default Index;
