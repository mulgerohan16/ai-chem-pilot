import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VAEModule } from "./VAEModule";
import { GANModule } from "./GANModule";
import { SMILESModule } from "./SMILESModule";

export const AIModules = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-light rounded-full text-primary font-medium text-sm mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Interactive AI Modules
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Advanced AI 
            <span className="bg-gradient-molecular bg-clip-text text-transparent"> Drug Discovery Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our cutting-edge AI modules for molecular generation, analysis, and validation. 
            Each module demonstrates the power of deep learning in pharmaceutical research.
          </p>
        </div>

        {/* AI Modules Tabs */}
        <Tabs defaultValue="vae" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vae" className="text-lg">
              <span className="mr-2">🧠</span>
              VAE Generator
            </TabsTrigger>
            <TabsTrigger value="gan" className="text-lg">
              <span className="mr-2">⚔️</span>
              GAN Training
            </TabsTrigger>
            <TabsTrigger value="smiles" className="text-lg">
              <span className="mr-2">🧪</span>
              SMILES Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vae">
            <VAEModule />
          </TabsContent>

          <TabsContent value="gan">
            <GANModule />
          </TabsContent>

          <TabsContent value="smiles">
            <SMILESModule />
          </TabsContent>
        </Tabs>

        {/* Info Footer */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-molecular border">
            <h3 className="text-xl font-bold text-card-foreground mb-4">Need Backend Integration?</h3>
            <p className="text-muted-foreground mb-6">
              These modules demonstrate frontend interfaces. For full AI model training and inference, 
              connect to Supabase to enable backend processing, model storage, and real-time analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-primary-light text-primary px-3 py-1 rounded-full">Real Model Training</span>
              <span className="bg-secondary-light text-secondary px-3 py-1 rounded-full">GPU Processing</span>
              <span className="bg-accent-light text-accent px-3 py-1 rounded-full">Database Storage</span>
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full">API Integration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};