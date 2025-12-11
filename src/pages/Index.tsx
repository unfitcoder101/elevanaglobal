import React, { useEffect, useState } from 'react';
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
  Copy
} from 'lucide-react';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const contactInfo = {
    email: 'hello@levra.co',
    phone: '+91 9166922448',
    instagram: 'https://www.instagram.com/levra.co'
  };

  useEffect(() => {
    const revealElements = () => {
      const elements = document.querySelectorAll('.reveal-up');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add('animate');
        }
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
      <div className="min-h-screen bg-background">
        
        {/* Header */}
        <header className={`fixed top-0 w-full z-50 transition-smooth ${isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6 py-5 flex items-center justify-between">
            
            {/* Logo */}
            <a 
              href="#hero" 
              onClick={(e) => scrollToSection(e, 'hero')}
              className="text-2xl font-light tracking-[0.3em] text-foreground cursor-pointer"
            >
              LEVRA
            </a>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-12">
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-smooth">Services</a>
              <a href="#results" onClick={(e) => scrollToSection(e, 'results')} className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-smooth">Results</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-smooth">About</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="hidden md:inline-flex">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="hidden md:inline-flex">
                    Sign In
                  </Button>
                  <Button variant="default" size="sm" onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')} className="hidden md:inline-flex">
                    Book a Call
                  </Button>
                </>
              )}
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden bg-background border-t border-border transition-all duration-300 ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <nav className="container mx-auto px-6 py-8 flex flex-col space-y-6">
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-sm tracking-wider text-muted-foreground">Services</a>
              <a href="#results" onClick={(e) => scrollToSection(e, 'results')} className="text-sm tracking-wider text-muted-foreground">Results</a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-sm tracking-wider text-muted-foreground">About</a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-sm tracking-wider text-muted-foreground">Contact</a>
              <div className="pt-4 space-y-3 border-t border-border">
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

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center pt-20">
          <div className="container mx-auto px-6 text-center reveal-up">
            
            <p className="text-sm tracking-[0.4em] text-muted-foreground mb-8 uppercase">
              Business Solutions & AI Agency
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight mb-8 leading-[1.1]">
              Elevation<br />
              <span className="text-muted-foreground">made effortless.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              We remove complexity from growth. Premium systems, intelligent automation, and strategic clarity for business owners who value their time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                variant="default" 
                size="xl" 
                onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
              >
                Start a Conversation
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => setServiceModalOpen(true)}
              >
                View Solutions
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-accent" />
                No long-term contracts
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-accent" />
                Results in 30 days
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-accent" />
                Satisfaction guaranteed
              </span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="results" className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 reveal-up">
              <p className="text-sm tracking-[0.3em] text-muted-foreground mb-4 uppercase">Results</p>
              <h2 className="text-3xl md:text-4xl font-extralight">
                Numbers that matter.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center reveal-up">
                <AnimatedCounter end={1500} duration={2500} label="Monthly Visitors Gained" />
              </div>
              <div className="text-center reveal-up">
                <AnimatedCounter end={345} duration={2500} label="New Bookings Created" />
              </div>
              <div className="text-center reveal-up">
                <AnimatedCounter end={52} duration={2500} label="Automations Deployed" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 reveal-up">
              <p className="text-sm tracking-[0.3em] text-muted-foreground mb-4 uppercase">Services</p>
              <h2 className="text-3xl md:text-4xl font-extralight mb-4">
                What we do.
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Clean solutions for complex problems. Each service designed to elevate your business without adding stress.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} className="bg-card border-border hover-lift reveal-up">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-medium tracking-wide mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-1 h-1 bg-accent mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12 reveal-up">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCustomizationModalOpen(true)}
              >
                Discuss Custom Solutions
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center reveal-up">
              <p className="text-sm tracking-[0.3em] text-muted-foreground mb-4 uppercase">About</p>
              <h2 className="text-3xl md:text-4xl font-extralight mb-8">
                LEVRA means elevation.
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  We exist to remove the friction between where you are and where you want to be. No fluff. No unnecessary complexity. Just clear, intelligent solutions that work.
                </p>
                <p>
                  Our approach is simple: understand deeply, build precisely, deliver excellence. Every system we create is designed to give you back your time while growing your business.
                </p>
                <p className="text-foreground font-medium">
                  Quiet confidence. Luxury-grade clarity. Growth made effortless.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 reveal-up">
              <p className="text-sm tracking-[0.3em] text-muted-foreground mb-4 uppercase">Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-extralight">
                Client experiences.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border reveal-up">
                  <CardContent className="p-8">
                    <p className="text-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center reveal-up">
              <h2 className="text-3xl md:text-4xl font-extralight mb-6">
                Ready to elevate?
              </h2>
              <p className="text-muted-foreground mb-8">
                Book a conversation. No pressure, no pitch—just a clear discussion about your goals and how we might help.
              </p>
              <Button 
                variant="default" 
                size="xl"
                onClick={() => window.open('https://calendly.com/elevanaglobal/30min', '_blank')}
              >
                Schedule Your Call
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-3xl font-light tracking-[0.3em] mb-8 md:mb-0">
                  LEVRA
                </div>
                <div className="flex items-center space-x-8">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={handleEmailClick}
                        className="text-background/70 hover:text-background transition-smooth"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex items-center space-x-2">
                        <span>{contactInfo.email}</span>
                        {copiedEmail && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => window.open(`tel:${contactInfo.phone}`, '_self')}
                        className="text-background/70 hover:text-background transition-smooth"
                      >
                        <Phone className="w-5 h-5" />
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
                        className="text-background/70 hover:text-background transition-smooth"
                      >
                        <Instagram className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>@levra.co</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="border-t border-background/20 pt-8 text-center">
                <p className="text-sm text-background/60">
                  © 2024 LEVRA. Elevation made effortless.
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
