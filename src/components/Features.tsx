import { Card } from "@/components/ui/card";

const features = [
  {
    icon: "🧬",
    title: "Generative AI Models",
    description: "Advanced VAEs and GANs trained on ZINC and ChEMBL datasets to generate novel drug-like molecules with unprecedented accuracy.",
    highlight: "VAEs & GANs"
  },
  {
    icon: "⚡",
    title: "Rapid Molecular Design",
    description: "Generate thousands of potential drug candidates in minutes, not months, using SMILES format molecular representations.",
    highlight: "10x Faster"
  },
  {
    icon: "🔬",
    title: "Property Prediction",
    description: "Advanced screening using RDKit and DeepChem to evaluate drug-likeness, solubility, toxicity, and molecular weight.",
    highlight: "RDKit & DeepChem"
  },
  {
    icon: "🎯",
    title: "Protein Docking",
    description: "AutoDock Vina simulations to predict binding affinity and molecular interactions with target proteins.",
    highlight: "AutoDock Vina"
  },
  {
    icon: "📊",
    title: "Intelligent Filtering",
    description: "AI-powered selection criteria to identify the most promising candidates for laboratory testing and validation.",
    highlight: "Smart Selection"
  },
  {
    icon: "💰",
    title: "Cost Optimization",
    description: "Reduce R&D expenses by up to 90% through computational pre-screening and intelligent candidate prioritization.",
    highlight: "90% Cost Savings"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-secondary-light rounded-full text-secondary font-medium text-sm mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
            Advanced Technology Stack
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Powered by Cutting-Edge 
            <span className="bg-gradient-molecular bg-clip-text text-transparent"> AI Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines multiple AI technologies and molecular analysis tools 
            to revolutionize the drug discovery process from molecule generation to validation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative p-8 bg-gradient-card border-0 shadow-molecular hover:shadow-scientific transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-molecular opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-glow transition-colors duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center px-3 py-1 bg-accent-light text-accent text-sm font-medium rounded-full">
                  {feature.highlight}
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-molecular scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-lg"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>Trusted by leading pharmaceutical companies worldwide</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};