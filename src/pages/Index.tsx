import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
  X
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
  const { toast } = useToast();

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Free Audit Request Sent!",
      description: "We'll contact you within 24 hours to schedule your consultation.",
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
      icon: <Instagram className="w-8 h-8" />,
      title: 'Instagram Optimization',
      description: 'Transform your Instagram into a customer magnet with strategic content, hashtags, and engagement tactics.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Local SEO & Google Profile',
      description: 'Dominate local search results and get found by customers in your area with optimized Google Business profiles.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Sales Automation',
      description: 'Automated lead capture and nurturing systems that convert prospects into paying customers 24/7.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Reputation Management',
      description: 'Build trust and credibility with review management and online reputation optimization.'
    }
  ];

  const trustLogos = [
    'Forbes Featured', 'Inc. 5000', 'Google Partner', 'Meta Business', 'Entrepreneur Mag'
  ];

  return (
    <div className="min-h-screen bg-background">
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
            <Button variant="cta" size="xl" onClick={handleFormSubmit}>
              Get Your Free Growth Audit
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              <Phone className="w-5 h-5" />
              Schedule a Call
            </Button>
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

      {/* Services Section */}
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
              <Card key={index} className="hover-lift reveal-up shadow-elegant">
                <CardContent className="p-6">
                  <div className="gradient-neon bg-clip-text text-transparent mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
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

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 reveal-up">
              <Badge variant="destructive" className="mb-4 px-4 py-2">
                🔥 Limited Time: Only 3 spots left this month
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get Your Free Growth Audit
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover exactly how to double your leads in the next 30 days
              </p>
            </div>

            <Card className="shadow-elegant reveal-up">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input type="tel" placeholder="(555) 123-4567" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type *</label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                          <SelectItem value="fitness">Fitness/Wellness</SelectItem>
                          <SelectItem value="beauty">Beauty/Salon</SelectItem>
                          <SelectItem value="healthcare">Healthcare/Medical</SelectItem>
                          <SelectItem value="realestate">Real Estate</SelectItem>
                          <SelectItem value="retail">Retail/E-commerce</SelectItem>
                          <SelectItem value="professional">Professional Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram Handle</label>
                    <Input placeholder="@yourbusiness" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What's your biggest challenge with growing your business online?
                    </label>
                    <Textarea 
                      placeholder="Tell us about your current struggles with online marketing..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" variant="cta" size="xl" className="w-full">
                    Book My Free Audit Call Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    No spam, ever. We respect your privacy and will only contact you about your growth audit.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
              GrowthLab
            </div>
            <p className="text-muted-foreground mb-6">
              Helping businesses grow their online presence and scale profits
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Mail className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <Instagram className="w-5 h-5" />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <Button variant="floating" size="lg" className="floating-cta">
        <Phone className="w-5 h-5" />
        Book Free Call
      </Button>
    </div>
  );
};

export default Index;
