import { Button } from "@/components/ui/button";
import heroImage from "@/assets/molecular-structure-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-glow rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary-glow rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-accent-glow rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-primary-light rounded-full text-primary font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              AI-Powered Drug Discovery
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Revolutionizing 
              <span className="bg-gradient-molecular bg-clip-text text-transparent"> Medicine Discovery</span> with AI
            </h1>
            <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-8 leading-relaxed">
              Accelerate pharmaceutical research by 10x using advanced Generative AI models to design, predict, and optimize drug molecules faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="scientific" size="lg" className="text-lg px-8 py-4">
                Explore Platform
              </Button>
              <Button variant="molecular" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">10x</div>
                <div className="text-primary-foreground/70">Faster Discovery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">90%</div>
                <div className="text-primary-foreground/70">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">1000s</div>
                <div className="text-primary-foreground/70">Molecules Generated</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-scientific">
              <img 
                src={heroImage} 
                alt="AI-generated molecular structure visualization" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-molecular animate-bounce">
              <span className="text-secondary-foreground font-bold">AI</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-molecular animate-pulse">
              <span className="text-accent-foreground text-2xl">⚛</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};