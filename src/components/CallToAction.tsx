import { Button } from "@/components/ui/button";
import labImage from "@/assets/ai-lab-research.jpg";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src={labImage} 
          alt="AI research laboratory" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-secondary-glow rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-glow rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full text-primary-foreground font-medium text-sm mb-8">
            <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2 animate-pulse"></span>
            Ready to Transform Drug Discovery?
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Accelerate Your Research with 
            <span className="bg-gradient-to-r from-secondary-glow to-accent-glow bg-clip-text text-transparent"> AI Innovation</span>
          </h2>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join leading pharmaceutical companies using our AI platform to discover breakthrough medicines 
            faster and more efficiently than ever before.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button variant="scientific" size="lg" className="text-lg px-10 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Start Free Trial
            </Button>
            <Button variant="molecular" size="lg" className="text-lg px-10 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              Schedule Demo
            </Button>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Quick Setup</h3>
              <p className="text-primary-foreground/70">Get started in minutes with our intuitive platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Enterprise Security</h3>
              <p className="text-primary-foreground/70">Bank-level encryption and compliance standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">24/7 Support</h3>
              <p className="text-primary-foreground/70">Dedicated scientific and technical support team</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-primary-foreground/60 mb-4">Trusted by researchers at:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-primary-foreground/50">
              <span className="text-lg font-semibold">Stanford University</span>
              <span className="text-lg font-semibold">MIT</span>
              <span className="text-lg font-semibold">Harvard Medical</span>
              <span className="text-lg font-semibold">Johns Hopkins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};