import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

interface GeneratedMolecule {
  id: string;
  smiles: string;
  properties: {
    mw: number;
    logp: number;
    hbd: number;
    hba: number;
    tpsa: number;
  };
  drugLikeness: number;
}

const mockMolecules: GeneratedMolecule[] = [
  {
    id: "1",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    properties: { mw: 180.16, logp: 1.19, hbd: 1, hba: 4, tpsa: 63.6 },
    drugLikeness: 0.89
  },
  {
    id: "2", 
    smiles: "CN1CCN(CC1)C2=CC=C(C=C2)OC",
    properties: { mw: 206.28, logp: 1.84, hbd: 0, hba: 3, tpsa: 15.3 },
    drugLikeness: 0.92
  },
  {
    id: "3",
    smiles: "CC1=CC=C(C=C1)S(=O)(=O)NC2=CC=CC=N2",
    properties: { mw: 248.30, logp: 1.67, hbd: 1, hba: 4, tpsa: 68.4 },
    drugLikeness: 0.76
  }
];

export const VAEModule = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedMolecules, setGeneratedMolecules] = useState<GeneratedMolecule[]>([]);
  const [latentDimensions] = useState([128]);
  const [temperature] = useState([0.8]);
  const [batchSize] = useState([10]);
  const { toast } = useToast();

  const generateMolecules = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedMolecules([]);

    // Simulate VAE generation process
    const steps = ["Encoding latent space...", "Sampling latent vectors...", "Decoding to SMILES...", "Validating structures..."];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress((i + 1) * 25);
      
      toast({
        title: "VAE Processing",
        description: steps[i],
      });
    }

    // Simulate generated results
    setGeneratedMolecules(mockMolecules);
    setIsGenerating(false);
    
    toast({
      title: "Generation Complete",
      description: `Generated ${mockMolecules.length} novel molecules`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-0 shadow-molecular">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Variational Autoencoder (VAE)</h2>
            <p className="text-muted-foreground">Generate novel molecular structures from learned latent representations</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">
              Latent Dimensions: {latentDimensions[0]}
            </label>
            <Slider
              value={latentDimensions}
              min={64}
              max={512}
              step={64}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">
              Temperature: {temperature[0]}
            </label>
            <Slider
              value={temperature}
              min={0.1}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">
              Batch Size: {batchSize[0]}
            </label>
            <Slider
              value={batchSize}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Generation Button */}
        <Button 
          onClick={generateMolecules}
          disabled={isGenerating}
          variant="scientific"
          size="lg"
          className="w-full mb-6"
        >
          {isGenerating ? "Generating Molecules..." : "Generate Novel Molecules"}
        </Button>

        {/* Progress */}
        {isGenerating && (
          <div className="mb-6">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              VAE Processing: {progress}% complete
            </p>
          </div>
        )}
      </Card>

      {/* Results */}
      {generatedMolecules.length > 0 && (
        <Card className="p-6 bg-card border shadow-molecular">
          <h3 className="text-xl font-bold text-card-foreground mb-4">Generated Molecules</h3>
          <div className="grid gap-4">
            {generatedMolecules.map((molecule, index) => (
              <div key={molecule.id} className="border rounded-lg p-4 bg-muted/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-card-foreground">Molecule {index + 1}</h4>
                    <code className="text-sm bg-primary-light px-2 py-1 rounded text-primary font-mono">
                      {molecule.smiles}
                    </code>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Drug-likeness</div>
                    <div className="text-lg font-bold text-accent">
                      {(molecule.drugLikeness * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground">MW</div>
                    <div className="font-semibold">{molecule.properties.mw}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">LogP</div>
                    <div className="font-semibold">{molecule.properties.logp}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">HBD</div>
                    <div className="font-semibold">{molecule.properties.hbd}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">HBA</div>
                    <div className="font-semibold">{molecule.properties.hba}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">TPSA</div>
                    <div className="font-semibold">{molecule.properties.tpsa}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};