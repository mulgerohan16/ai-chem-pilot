import aiNetworkImage from "@/assets/ai-molecules-network.jpg";

const processSteps = [
  {
    number: "01",
    title: "Data Training",
    description: "AI models trained on ZINC and ChEMBL molecular databases containing millions of verified chemical compounds in SMILES format.",
    technologies: ["ZINC Database", "ChEMBL", "SMILES Format"],
    color: "primary"
  },
  {
    number: "02", 
    title: "Molecule Generation",
    description: "Variational Autoencoders and Generative Adversarial Networks create novel drug-like molecular structures with desired properties.",
    technologies: ["VAEs", "GANs", "Deep Learning"],
    color: "secondary"
  },
  {
    number: "03",
    title: "Property Analysis",
    description: "Advanced computational chemistry tools evaluate drug-likeness, solubility, toxicity, and pharmacokinetic properties.",
    technologies: ["RDKit", "DeepChem", "ADMET Analysis"],
    color: "accent"
  },
  {
    number: "04",
    title: "Molecular Docking",
    description: "Protein-drug interaction simulations predict binding affinity and mechanism of action for target validation.",
    technologies: ["AutoDock Vina", "Protein Modeling", "Binding Analysis"],
    color: "primary"
  },
  {
    number: "05",
    title: "Intelligent Selection",
    description: "AI-powered ranking system identifies the most promising candidates for synthesis and laboratory testing.",
    technologies: ["ML Scoring", "Multi-objective Optimization", "Risk Assessment"],
    color: "secondary"
  }
];

export const Process = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent-light rounded-full text-accent font-medium text-sm mb-6">
            <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
            AI-Driven Workflow
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            From Data to 
            <span className="bg-gradient-molecular bg-clip-text text-transparent"> Discovery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Our comprehensive AI pipeline transforms raw molecular data into validated drug candidates 
            through intelligent automation and advanced computational methods.
          </p>
          
          {/* Central Image */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <img 
              src={aiNetworkImage} 
              alt="AI molecular network visualization" 
              className="w-full rounded-2xl shadow-scientific"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"></div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-12">
          {processSteps.map((step, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className={`
                  w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold
                  ${step.color === 'primary' ? 'bg-primary text-primary-foreground shadow-glow' : ''}
                  ${step.color === 'secondary' ? 'bg-secondary text-secondary-foreground shadow-molecular' : ''}
                  ${step.color === 'accent' ? 'bg-accent text-accent-foreground shadow-molecular' : ''}
                  transition-all duration-500 hover:scale-110
                `}>
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {step.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium
                        ${step.color === 'primary' ? 'bg-primary-light text-primary' : ''}
                        ${step.color === 'secondary' ? 'bg-secondary-light text-secondary' : ''}
                        ${step.color === 'accent' ? 'bg-accent-light text-accent' : ''}
                      `}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connection Line */}
              {index < processSteps.length - 1 && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 lg:top-1/2 lg:left-16 lg:transform-none w-px h-16 lg:w-16 lg:h-px bg-gradient-molecular"></div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};