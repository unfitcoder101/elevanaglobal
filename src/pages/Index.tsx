import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
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

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { toast } = useToast();

  // Contact Information
  const contactInfo = {
    email: 'hello@growthlab.com',
    phone: '+1 (555) 123-4567',
    instagram: '@growthlab_agency'
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
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              GrowthLab
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-foreground hover:text-primary transition-smooth">Services</a>
              <a href="#results" className="text-foreground hover:text-primary transition-smooth">Results</a>
              <a href="#testimonials" className="text-foreground hover:text-primary transition-smooth">Testimonials</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-smooth">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="gradient" size="lg" className="hidden md:inline-flex">
                Book Free Audit Call
                <ArrowRight className="w-4 h-4" />
              </Button>
              
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
                <Button variant="gradient" size="lg" className="w-full">
                  Book Free Audit Call
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
          
          <div className="relative container mx-auto px-4 text-center reveal-up">
            <Badge variant="outline" className="mb-8 px-4 py-2 text-sm font-medium">
              ⚡ Only 3 free audits left this month
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Your Business Into a
              <span className="gradient-primary bg-clip-text text-transparent block">Customer Magnet</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We help service businesses get more customers and scale profits through strategic 
              Instagram optimization, local SEO, and automated sales systems.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="cta" size="xl" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Your Free Growth Audit
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

        {/* Trust Logos */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 reveal-up">
              <p className="text-muted-foreground mb-4">Trusted by top brands and featured in</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {trustLogos.map((logo, index) => (
                  <Badge key={index} variant="outline" className="px-4 py-2 text-sm font-medium">
                    {logo}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Real Results for Real Businesses
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our proven strategies deliver measurable growth that transforms businesses
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {results.map((result, index) => (
                <Card key={index} className="text-center hover-lift reveal-up shadow-elegant">
                  <CardContent className="pt-8">
                    <div className="text-4xl md:text-5xl font-bold gradient-accent bg-clip-text text-transparent mb-2">
                      {result.metric}
                    </div>
                    <p className="text-muted-foreground">{result.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section id="services" className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                How We Grow Your Business
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive approach covers every aspect of your digital presence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
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
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-muted-foreground">
                Real stories from businesses that transformed their growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover-lift reveal-up shadow-elegant">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Google Form Contact Section */}
        <section id="contact" className="py-24 bg-muted/20">
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
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
                GrowthLab
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
      </div>
    </TooltipProvider>
  );
};

export default Index;
