import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import ContactModal from '@/components/ContactModal';
import CustomizationModal from '@/components/CustomizationModal';
import ChatBot from '@/components/ChatBot';
import ServiceSelectionModal from '@/components/ServiceSelectionModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AnimatedCounter from '@/components/AnimatedCounter';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  Instagram, 
  Globe, 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  Menu,
  X,
  Zap,
  Target,
  Rocket,
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react';

// Import generated images
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';
import testimonial3 from '@/assets/testimonial-3.jpg';
import testimonial4 from '@/assets/testimonial-4.jpg';
import heroBackground from '@/assets/hero-background.jpg';

// Import new testimonial images
import testimonialRohit from '@/assets/testimonial-rohit.jpg';
import testimonialClaire from '@/assets/testimonial-claire.jpg';
import testimonialLiam from '@/assets/testimonial-liam.jpg';
import testimonialJade from '@/assets/testimonial-jade.jpg';

// Import proof screenshots
import whatsappSalon from '@/assets/testimonial-whatsapp-salon.jpg';
import calendarDashboard from '@/assets/testimonial-calendar-dashboard.jpg';
import instagramGrowth from '@/assets/testimonial-instagram-growth.jpg';
import instagramDms from '@/assets/testimonial-instagram-dms.jpg';
import paymentNotifications from '@/assets/testimonial-payment-notifications.jpg';

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

  // Contact Information
  const contactInfo = {
    email: 'hello@agencyx.com',
    phone: '+1 (555) 123-4567',
    instagram: '@agencyx_digital'
  };

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Reveal animations
      const elements = document.querySelectorAll('.reveal-up');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          el.classList.add('animate');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(contactInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
    toast({
      title: "Email copied!",
      description: `${contactInfo.email} has been copied to your clipboard`,
    });
  };

  const newTestimonials = [
    {
      name: 'Rohit S.',
      title: 'Gym Owner (India)',
      image: testimonialRohit,
      content: 'These guys helped me turn random DMs into real clients. I\'ve already added two new trainers.'
    },
    {
      name: 'Claire W.',
      title: 'Salon Owner (London)',
      image: testimonialClaire,
      content: 'Our salon bookings shot up after their Insta revamp. Couldn\'t have done it alone.'
    },
    {
      name: 'Liam J.',
      title: 'Real Estate Agent (Los Angeles)',
      image: testimonialLiam,
      content: 'Got 3 new buyers from just one campaign. They really know how to sell.'
    },
    {
      name: 'Jade K.',
      title: 'Yoga Studio Owner (Sydney)',
      image: testimonialJade,
      content: 'The website and WhatsApp funnel they built made my life so easy.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      title: 'Restaurant Owner',
      image: testimonial1,
      content: 'After working with them, our local foot traffic increased by 47% in just 3 weeks. Our Instagram following doubled and our Google reviews went from 3.2 to 4.8 stars. Incredible results!'
    },
    {
      name: 'Marcus Johnson',
      title: 'Fitness Studio Owner',
      image: testimonial2,
      content: 'They completely transformed our online presence. We went from 50 leads per month to over 200. The automation system they built saves us 20 hours per week.'
    },
    {
      name: 'David Chen',
      title: 'Real Estate Agent',
      image: testimonial3,
      content: 'My business revenue increased by 85% after their Instagram optimization. The lead generation system they created brings in qualified prospects daily.'
    },
    {
      name: 'Emma Rodriguez',
      title: 'Dental Practice Manager',
      image: testimonial4,
      content: 'Patient bookings increased by 62% and our online reputation is now spotless. They know exactly how to position service businesses for growth.'
    }
  ];

  const results = [
    { metric: '47%', description: 'Average increase in local reach' },
    { metric: '35%', description: 'More foot traffic in 3 weeks' },
    { metric: '200+', description: 'New leads generated monthly' },
    { metric: '85%', description: 'Revenue growth for clients' }
  ];

  const services = [
    {
      icon: <Instagram className="w-12 h-12" />,
      title: 'Instagram Optimization',
      description: 'Transform your Instagram into a customer magnet with strategic content, hashtags, and engagement tactics.',
      features: ['Content Strategy', 'Hashtag Research', 'Engagement Boost', 'Story Optimization'],
      gradient: 'from-pink-500 to-purple-600'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'Local SEO & Google Profile',
      description: 'Dominate local search results and get found by customers in your area with optimized Google Business profiles.',
      features: ['Google My Business', 'Local Citations', 'Review Management', 'Map Optimization'],
      gradient: 'from-blue-500 to-teal-600'
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: 'Sales Automation',
      description: 'Automated lead capture and nurturing systems that convert prospects into paying customers 24/7.',
      features: ['Lead Capture', 'Email Sequences', 'CRM Integration', 'Analytics Dashboard'],
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Reputation Management',
      description: 'Build trust and credibility with review management and online reputation optimization.',
      features: ['Review Monitoring', 'Response Management', 'Rating Improvement', 'Crisis Prevention'],
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Business Automation',
      description: 'Streamline your operations with intelligent automation that handles bookings, follow-ups, and customer communication.',
      features: ['Booking Automation', 'Follow-up Sequences', 'Customer Support Bots', 'Workflow Optimization'],
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: '🛠️ Tailored Growth Solutions – Built Around Your Business',
      description: 'Not every business needs the same blueprint. That\'s why we offer custom solutions designed exactly for your growth goals — whether you\'re starting from scratch or scaling fast.',
      features: [
        'Full Website Creation – Landing pages to full-stack builds',
        'UI/UX Design – Clean, modern layouts that convert',
        'Hosting & Deployment – Stress-free, fast, and secure',
        'Automation Setup – From DMs to email flows',
        'Business Strategy – Sales scripts, repeat client playbooks, and more'
      ],
      gradient: 'from-cyan-500 to-blue-600',
      isCustomPlan: true
    }
  ];

  const trustLogos = [
    'Forbes Featured', 'Inc. 5000', 'Google Partner', 'Meta Business', 'Entrepreneur Mag'
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-full animate-spin opacity-30"
               style={{ animationDuration: '20s' }} />
          <div className="absolute top-40 right-20 w-24 h-24 border border-accent/20 rotate-45 animate-pulse opacity-20"
               style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-neon/10 to-primary/10 rounded-lg animate-bounce opacity-40"
               style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 right-10 w-20 h-20 border-2 border-primary/15 rounded-full animate-pulse opacity-30"
               style={{ animationDuration: '5s' }} />
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse opacity-60"
               style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-neon/3 to-primary/3 rounded-full blur-3xl animate-pulse opacity-40"
               style={{ animationDuration: '12s' }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full"
                 style={{
                   backgroundImage: `
                     linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                     linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                   `,
                   backgroundSize: '50px 50px',
                   animation: 'grid-shift 20s linear infinite'
                 }} />
          </div>
        </div>
        
        {/* Sticky Header */}
        <header className={`fixed top-0 w-full z-50 transition-smooth ${isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-elegant' : 'bg-transparent'}`}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="#hero" 
               className="flex items-center text-3xl font-extrabold pl-6 cursor-pointer transition-all duration-300 hover:opacity-80 font-poppins"
               style={{ color: '#008C8C', letterSpacing: '0.5px' }}>
              ELEVANA<span style={{ color: '#20C997' }}>.</span>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-foreground hover:text-primary transition-smooth">Services</a>
              <a href="#results" className="text-foreground hover:text-primary transition-smooth">Results</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-smooth">Testimonials</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-smooth">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button variant="gradient" size="lg" className="hidden md:inline-flex" onClick={() => navigate('/dashboard')}>
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" className="hidden md:inline-flex" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button variant="gradient" size="lg" className="hidden md:inline-flex" onClick={() => setContactModalOpen(true)}>
                    Book Free Call
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-background border-t">
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <a href="#services" className="text-foreground hover:text-primary transition-smooth">Services</a>
                <a href="#results" className="text-foreground hover:text-primary transition-smooth">Results</a>
                <a href="#testimonials" className="text-foreground hover:text-primary transition-smooth">Testimonials</a>
                <a href="#contact" className="text-foreground hover:text-primary transition-smooth">Contact</a>
                {user ? (
                  <Button variant="gradient" size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
                    Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="lg" className="w-full mb-2" onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                    <Button variant="gradient" size="lg" className="w-full" onClick={() => setContactModalOpen(true)}>
                      Book Free Call
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>

        {/* 1. Hero Section - The Imagination Hook */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
          
          {/* Floating Elements Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-neon rounded-full animate-bounce opacity-60" 
                 style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary/40 rounded-full animate-pulse opacity-80" 
                 style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-accent rounded-full animate-bounce opacity-70" 
                 style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-neon/60 rounded-full animate-pulse opacity-50" 
                 style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          </div>
          
          <div className="relative container mx-auto px-4 text-center reveal-up pt-20">
            <div className="mb-8 inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon/10 to-primary/10 rounded-full border border-neon/20 backdrop-blur-sm animate-pulse">
              <div className="w-2 h-2 bg-neon rounded-full mr-3 animate-ping"></div>
              <span className="text-sm font-medium text-neon">⚡ Only 3 free audits left this month</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="gradient-primary bg-clip-text text-transparent animate-text-shimmer">
                Imagine this…
              </span>
            </h1>
            
            <div className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto space-y-3">
              <p>You wake up to booked appointments.</p>
              <p>Your DMs are already answered.</p>
              <p>Clients rebook themselves.</p>
              <p className="text-base text-muted-foreground/80">And your competitors? Still stuck trying to figure out how to post Reels.</p>
            </div>
            
            <p className="text-xl text-foreground font-semibold mb-12 max-w-2xl mx-auto">
              That's the unfair advantage we give to local businesses — salons, cafés, gyms, and more.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="cta" size="xl" className="hover:scale-105 transition-transform" onClick={() => setContactModalOpen(true)}>
                🔥 Book Your Free Demo Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="xl">
                    <Phone className="w-5 h-5" />
                    Schedule a Call
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{contactInfo.phone}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-neon mr-2" />
                No long-term contracts
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-neon mr-2" />
                Results in 30 days
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-neon mr-2" />
                100% satisfaction guarantee
              </span>
            </div>
          </div>
        </section>

        {/* Animated Social Proof Counters */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 reveal-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Trusted by Growing Businesses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real numbers from real businesses we've helped transform
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <AnimatedCounter 
                end={1500} 
                duration={3000}
                emoji="👥"
                label="Monthly Visitors Gained"
              />
              <AnimatedCounter 
                end={345} 
                duration={2500}
                emoji="📆"
                label="New Bookings Created"
              />
              <AnimatedCounter 
                end={52} 
                duration={3500}
                emoji="🛠️"
                label="Automations Deployed"
              />
            </div>
          </div>
        </section>


        {/* 3. Transformation Section - "Now Imagine This Instead" */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <strong>Imagine this.</strong>
              </h2>
              
              <div className="max-w-2xl mx-auto space-y-6 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">💬</span>
                  <p className="text-lg text-foreground">Your DMs reply themselves.</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <p className="text-lg text-foreground">Clients book — and rebook — automatically.</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🚀</span>
                  <p className="text-lg text-foreground">Your business grows while you sleep.</p>
                </div>
              </div>
              
              <div className="mt-12">
                <Button variant="cta" size="xl" className="hover:scale-105 transition-transform">
                  ✨ Show Me How This Works
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Enhanced Services Section */}
        <section id="services" className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                How We Grow Your Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive approach covers every aspect of your digital presence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                if (service.isCustomPlan) {
                  return (
                    <Card key={index} className="group hover-lift reveal-up shadow-elegant border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden relative md:col-span-2">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                      <CardContent className="p-8 relative z-10">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <div className="text-white">
                            {service.icon}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <div className="text-muted-foreground mb-6 leading-relaxed space-y-4">
                          <p>{service.description}</p>
                          <p className="font-medium">Here's what we can help you with:</p>
                          <div className="space-y-2 pl-4">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start text-sm">
                                <span className="text-muted-foreground mr-2">•</span>
                                <span className="text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                          <p className="font-medium text-foreground">Just tell us what you need — we'll map out a solution.</p>
                        </div>
                        <Button variant="cta" size="lg" className="hover:scale-105 transition-transform">
                          🔘 Get Your Custom Plan
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                }
                
                return (
                  <Card key={index} className="group hover-lift reveal-up shadow-elegant border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    <CardContent className="p-8 relative z-10">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {service.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-3`} />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOMO Box Section */}
        <section className="py-20 bg-gradient-to-br from-destructive/5 to-orange-500/5 border-y border-destructive/10">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto shadow-elegant border-destructive/20 bg-gradient-to-br from-card to-destructive/5 reveal-up">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-destructive/10 rounded-full mb-8 animate-pulse">
                  <div className="w-3 h-3 bg-destructive rounded-full mr-3 animate-ping"></div>
                  <span className="text-destructive font-semibold text-lg">🔴 URGENT REALITY CHECK</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  <span className="text-destructive">85%</span> of local businesses lose{" "}
                  <span className="text-destructive">60%</span> of potential clients
                </h3>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  — just because they reply late or don't look premium online.
                </p>
                
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20">
                  <p className="text-lg font-medium mb-4">
                    Don't let that be you. Our system books clients, answers DMs, and boosts your brand while you focus on doing what you love.
                  </p>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-neon mr-2" />
                    Others are winning, you're being left behind
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>


        {/* Premium Client Testimonials Section */}
        <section id="client-testimonials" className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins" style={{ color: '#008C8C' }}>
                What Our Clients Say
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real businesses achieving real growth with our proven systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {newTestimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden relative reveal-up"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 140, 140, 0.1)',
                    transform: 'translateY(0)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 140, 140, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 140, 140, 0.1)';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-4 mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                        style={{ 
                          filter: 'blur(0.5px)',
                          borderColor: '#20C997'
                        }}
                      />
                      <div className="flex-1">
                        <blockquote className="text-lg leading-relaxed text-gray-700 font-poppins mb-4">
                          "{testimonial.content}"
                        </blockquote>
                        <div className="font-poppins">
                          <div className="font-semibold italic text-base" style={{ color: '#008C8C' }}>
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {testimonial.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* 5. Case Study / Project Video Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Proof in Action
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Here's What Business Owners Are Saying Behind the Scenes 👇
              </p>
              
              {/* Screenshot Grid */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="reveal-up">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={whatsappSalon} 
                      alt="WhatsApp conversation with salon client"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground italic mt-4 text-center">
                    "Client rebookings doubled in 14 days"
                  </p>
                </div>
                
                <div className="reveal-up">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={calendarDashboard} 
                      alt="Calendar booking dashboard"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground italic mt-4 text-center">
                    "Calendar's filling fast, thanks to automation"
                  </p>
                </div>
                
                <div className="reveal-up">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={instagramGrowth} 
                      alt="Instagram growth analytics"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground italic mt-4 text-center">
                    "Instagram reach tripled in 3 weeks"
                  </p>
                </div>
                
                <div className="reveal-up">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={instagramDms} 
                      alt="Instagram automated DMs"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground italic mt-4 text-center">
                    "DMs now work while they sleep"
                  </p>
                </div>
                
                <div className="reveal-up">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={paymentNotifications} 
                      alt="Payment notifications dashboard"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground italic mt-4 text-center">
                    "Online payments flowing 24/7"
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <Button variant="cta" size="xl" className="hover:scale-105 transition-transform" onClick={() => setServiceModalOpen(true)}>
                  🚀 I Want Results Like This
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>



        {/* Google Form Contact Section */}
        <section id="contact" className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 reveal-up">
                <Badge variant="destructive" className="mb-4 px-4 py-2">
                  🔥 Limited Time: Only 3 spots left this month
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Get Your Free Growth Audit
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Discover exactly how to double your leads in the next 30 days
                </p>
              </div>

              <Card className="shadow-elegant reveal-up">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground mb-4">
                      Fill out our comprehensive form to get your personalized growth strategy
                    </p>
                    <Button 
                      variant="gradient" 
                      size="lg"
                      onClick={() => window.open('https://forms.google.com/your-form-url', '_blank')}
                      className="w-full md:w-auto"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open Growth Audit Form
                    </Button>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">What we'll cover in your audit:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Instagram Analysis</p>
                          <p className="text-sm text-muted-foreground">Complete profile optimization review</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Local SEO Audit</p>
                          <p className="text-sm text-muted-foreground">Google Business Profile optimization</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Competitor Analysis</p>
                          <p className="text-sm text-muted-foreground">See what your competitors are doing wrong</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-neon mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Growth Strategy</p>
                          <p className="text-sm text-muted-foreground">Custom roadmap to double your leads</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer with Interactive Contact Icons */}
        <footer className="py-12 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-3xl font-semibold mb-4" style={{ color: '#222831' }}>
                ELEVANA
              </div>
              <p className="text-muted-foreground mb-6">
                Helping businesses grow their online presence and scale profits
              </p>
              <div className="flex items-center justify-center space-x-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleEmailClick}
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <Mail className="w-6 h-6 text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center space-x-2">
                      <span>{contactInfo.email}</span>
                      {copiedEmail ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => window.open(`tel:${contactInfo.phone}`, '_self')}
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <Phone className="w-6 h-6 text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contactInfo.phone}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => window.open(`https://instagram.com/${contactInfo.instagram.replace('@', '')}`, '_blank')}
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <Instagram className="w-6 h-6 text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contactInfo.instagram}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating CTA Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="floating" 
              size="lg" 
              className="floating-cta"
              onClick={() => window.open(`tel:${contactInfo.phone}`, '_self')}
            >
              <Phone className="w-5 h-5" />
              Book Free Call
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Call us at {contactInfo.phone}</p>
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
