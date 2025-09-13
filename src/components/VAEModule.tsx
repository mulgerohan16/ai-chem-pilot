import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MolecularVisualizer } from "./MolecularVisualizer";
import { PropertyFilter, FilterCriteria } from "./PropertyFilter";
import { Download, RefreshCw, Filter } from "lucide-react";

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
  
  // VAE Architecture Parameters
  const [latentDimensions, setLatentDimensions] = useState([128]);
  const [encoderLayers, setEncoderLayers] = useState([3]);
  const [decoderLayers, setDecoderLayers] = useState([3]);
  const [hiddenSize, setHiddenSize] = useState([512]);
  
  // Training Parameters
  const [learningRate, setLearningRate] = useState([0.001]);
  const [betaKL, setBetaKL] = useState([1.0]);
  const [epochs, setEpochs] = useState([100]);
  const [dropout, setDropout] = useState([0.2]);
  
  // Generation Parameters
  const [temperature, setTemperature] = useState([0.8]);
  const [batchSize, setBatchSize] = useState([10]);
  const [diversityWeight, setDiversityWeight] = useState([0.5]);
  const [noveltyThreshold, setNoveltyThreshold] = useState([0.7]);
  
  // Model Status
  const [modelStatus, setModelStatus] = useState<'untrained' | 'training' | 'trained'>('untrained');
  const [trainingLoss, setTrainingLoss] = useState<number>(0);
  const [klDivergence, setKlDivergence] = useState<number>(0);
  const [reconstructionLoss, setReconstructionLoss] = useState<number>(0);
  
  // Interactive Features
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMolecules, setFilteredMolecules] = useState<GeneratedMolecule[]>([]);
  
  const { toast } = useToast();

  // Calculate parameter-dependent generation quality
  const calculateGenerationQuality = () => {
    const tempFactor = Math.max(0.1, Math.min(1.0, 1.2 - temperature[0]));
    const dimFactor = Math.min(1.0, latentDimensions[0] / 256);
    const diversityFactor = diversityWeight[0];
    return tempFactor * dimFactor * diversityFactor;
  };

  const trainModel = async () => {
    setModelStatus('training');
    setIsGenerating(true);
    setProgress(0);

    const totalEpochs = epochs[0];
    const steps = ["Initializing encoder...", "Initializing decoder...", "Starting training loop...", "Optimizing latent space..."];
    
    for (let epoch = 1; epoch <= totalEpochs; epoch += Math.floor(totalEpochs / 4)) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const progressPercent = (epoch / totalEpochs) * 100;
      setProgress(progressPercent);
      
      // Simulate training metrics based on parameters
      const baseLoss = 2.5;
      const learningDecay = Math.exp(-learningRate[0] * epoch / 10);
      const newTrainingLoss = baseLoss * learningDecay + Math.random() * 0.1;
      const newKL = betaKL[0] * (0.5 + Math.random() * 0.3);
      const newRecon = newTrainingLoss - newKL;
      
      setTrainingLoss(newTrainingLoss);
      setKlDivergence(newKL);
      setReconstructionLoss(newRecon);
      
      const stepIndex = Math.floor((epoch / totalEpochs) * steps.length);
      if (stepIndex < steps.length) {
        toast({
          title: `Training Epoch ${epoch}`,
          description: `${steps[stepIndex]} Loss: ${newTrainingLoss.toFixed(3)}`,
        });
      }
    }

    setModelStatus('trained');
    setIsGenerating(false);
    toast({
      title: "Training Complete",
      description: `VAE model trained successfully with ${latentDimensions[0]}D latent space`,
    });
  };

  const generateMolecules = async () => {
    if (modelStatus !== 'trained') {
      toast({
        title: "Model Not Trained",
        description: "Please train the VAE model first before generating molecules",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedMolecules([]);

    const steps = [
      "Sampling from latent space...", 
      "Applying temperature scaling...", 
      "Decoding to SMILES...", 
      "Filtering by novelty threshold...", 
      "Validating molecular structures..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProgress((i + 1) * 20);
      
      toast({
        title: "VAE Generation",
        description: steps[i],
      });
    }

    // Generate molecules based on parameters
    const quality = calculateGenerationQuality();
    const numMolecules = Math.min(batchSize[0], mockMolecules.length);
    const selectedMolecules = mockMolecules.slice(0, numMolecules).map(mol => ({
      ...mol,
      drugLikeness: Math.min(0.99, mol.drugLikeness * quality + Math.random() * 0.1),
      properties: {
        ...mol.properties,
        mw: mol.properties.mw * (0.8 + temperature[0] * 0.4),
        logp: mol.properties.logp * (0.7 + diversityWeight[0] * 0.6)
      }
    }));

    setGeneratedMolecules(selectedMolecules);
    setIsGenerating(false);
    
    toast({
      title: "Generation Complete",
      description: `Generated ${selectedMolecules.length} molecules with ${(quality * 100).toFixed(1)}% quality score`,
    });
  };

  const resetModel = () => {
    setModelStatus('untrained');
    setGeneratedMolecules([]);
    setFilteredMolecules([]);
    setProgress(0);
    setTrainingLoss(0);
    setKlDivergence(0);
    setReconstructionLoss(0);
    setSelectedMolecule(null);
    toast({
      title: "Model Reset",
      description: "VAE model has been reset to untrained state",
    });
  };

  const handleFilterChange = (criteria: FilterCriteria) => {
    const filtered = generatedMolecules.filter(mol => {
      const mw = mol.properties.mw;
      const logp = mol.properties.logp;
      const hbd = mol.properties.hbd;
      const hba = mol.properties.hba;
      const tpsa = mol.properties.tpsa;
      
      return (
        mw >= criteria.mwRange[0] && mw <= criteria.mwRange[1] &&
        logp >= criteria.logpRange[0] && logp <= criteria.logpRange[1] &&
        hbd <= criteria.hbdMax &&
        hba <= criteria.hbaMax &&
        tpsa >= criteria.tpsaRange[0] && tpsa <= criteria.tpsaRange[1] &&
        mol.drugLikeness >= criteria.qedMin
      );
    });
    setFilteredMolecules(filtered);
  };

  const exportResults = () => {
    if (generatedMolecules.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Generate some molecules first before exporting",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = generatedMolecules.map(mol => ({
        SMILES: mol.smiles,
        DrugLikeness: mol.drugLikeness,
        MolecularWeight: mol.properties.mw,
        LogP: mol.properties.logp,
        HBD: mol.properties.hbd,
        HBA: mol.properties.hba,
        TPSA: mol.properties.tpsa
      }));
      
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vae_generated_molecules.csv';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Exported ${data.length} molecules to CSV file`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  // Initialize filtered molecules when generated molecules change
  useEffect(() => {
    setFilteredMolecules(generatedMolecules);
  }, [generatedMolecules]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-0 shadow-molecular">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">Variational Autoencoder (VAE)</h2>
              <p className="text-muted-foreground">Generate novel molecular structures from learned latent representations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              modelStatus === 'trained' ? 'default' : 
              modelStatus === 'training' ? 'secondary' : 
              'outline'
            }>
              {modelStatus === 'trained' ? '✓ Trained' : 
               modelStatus === 'training' ? '🔄 Training' : 
               '⚠ Untrained'}
            </Badge>
            {modelStatus === 'trained' && (
              <Button variant="outline" size="sm" onClick={resetModel}>
                Reset
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="architecture" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="generation">Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Network Architecture</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Latent Dimensions: {latentDimensions[0]}
                    </label>
                    <Slider
                      value={latentDimensions}
                      onValueChange={setLatentDimensions}
                      min={32}
                      max={1024}
                      step={32}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Encoder Layers: {encoderLayers[0]}
                    </label>
                    <Slider
                      value={encoderLayers}
                      onValueChange={setEncoderLayers}
                      min={2}
                      max={8}
                      step={1}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Decoder Layers: {decoderLayers[0]}
                    </label>
                    <Slider
                      value={decoderLayers}
                      onValueChange={setDecoderLayers}
                      min={2}
                      max={8}
                      step={1}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Layer Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Hidden Size: {hiddenSize[0]}
                    </label>
                    <Slider
                      value={hiddenSize}
                      onValueChange={setHiddenSize}
                      min={128}
                      max={2048}
                      step={128}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Dropout Rate: {dropout[0].toFixed(2)}
                    </label>
                    <Slider
                      value={dropout}
                      onValueChange={setDropout}
                      min={0.0}
                      max={0.8}
                      step={0.1}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Training Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Learning Rate: {learningRate[0].toFixed(4)}
                    </label>
                    <Slider
                      value={learningRate}
                      onValueChange={setLearningRate}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Beta (KL Weight): {betaKL[0].toFixed(2)}
                    </label>
                    <Slider
                      value={betaKL}
                      onValueChange={setBetaKL}
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Training Epochs: {epochs[0]}
                    </label>
                    <Slider
                      value={epochs}
                      onValueChange={setEpochs}
                      min={50}
                      max={500}
                      step={50}
                      className="w-full"
                      disabled={modelStatus !== 'untrained'}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Training Metrics</h4>
                {modelStatus === 'trained' && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-primary-light p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-primary">{trainingLoss.toFixed(3)}</div>
                      <div className="text-sm text-muted-foreground">Total Loss</div>
                    </div>
                    <div className="bg-secondary-light p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-secondary">{klDivergence.toFixed(3)}</div>
                      <div className="text-sm text-muted-foreground">KL Divergence</div>
                    </div>
                    <div className="bg-accent-light p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-accent">{reconstructionLoss.toFixed(3)}</div>
                      <div className="text-sm text-muted-foreground">Reconstruction Loss</div>
                    </div>
                  </div>
                )}
                {modelStatus === 'untrained' && (
                  <p className="text-muted-foreground text-center py-8">
                    Train the model to see metrics
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              onClick={trainModel}
              disabled={isGenerating || modelStatus === 'trained'}
              variant="scientific"
              size="lg"
              className="w-full"
            >
              {modelStatus === 'training' ? "Training in Progress..." : 
               modelStatus === 'trained' ? "Model Already Trained" : 
               "Train VAE Model"}
            </Button>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Generation Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Temperature: {temperature[0].toFixed(2)}
                    </label>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Higher = more diverse, lower = more conservative</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Diversity Weight: {diversityWeight[0].toFixed(2)}
                    </label>
                    <Slider
                      value={diversityWeight}
                      onValueChange={setDiversityWeight}
                      min={0.0}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Novelty Threshold: {noveltyThreshold[0].toFixed(2)}
                    </label>
                    <Slider
                      value={noveltyThreshold}
                      onValueChange={setNoveltyThreshold}
                      min={0.3}
                      max={0.9}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Output Control</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Batch Size: {batchSize[0]}
                    </label>
                    <Slider
                      value={batchSize}
                      onValueChange={setBatchSize}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-card-foreground mb-2">Quality Prediction</div>
                    <div className="text-2xl font-bold text-accent mb-1">
                      {(calculateGenerationQuality() * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on current parameter settings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={generateMolecules}
              disabled={isGenerating || modelStatus !== 'trained'}
              variant="scientific"
              size="lg"
              className="w-full"
            >
              {isGenerating ? "Generating Molecules..." : "Generate Novel Molecules"}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Progress */}
        {isGenerating && (
          <div className="mt-6">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {modelStatus === 'training' ? 'Training' : 'Generation'} Progress: {progress.toFixed(1)}% complete
            </p>
          </div>
        )}
      </Card>

      {/* Generated Molecules */}
      {generatedMolecules.length > 0 && (
        <Card className="p-6 bg-card border shadow-molecular">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-card-foreground">Generated Molecules</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={generateMolecules}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6">
              <PropertyFilter 
                onFilterChange={handleFilterChange}
                moleculeCount={generatedMolecules.length}
                filteredCount={filteredMolecules.length}
              />
            </div>
          )}

          <div className="grid gap-6">
            {(showFilters ? filteredMolecules : generatedMolecules).map((molecule, index) => (
              <div key={molecule.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Badge variant={molecule.drugLikeness > 0.8 ? "default" : "secondary"}>
                        {(molecule.drugLikeness * 100).toFixed(1)}% Drug-like
                      </Badge>
                    </div>
                    <code className="text-sm font-mono text-primary block mb-2">
                      {molecule.smiles}
                    </code>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-muted-foreground">
                      <span>MW: {molecule.properties.mw.toFixed(1)}</span>
                      <span>LogP: {molecule.properties.logp.toFixed(2)}</span>
                      <span>HBD: {molecule.properties.hbd}</span>
                      <span>HBA: {molecule.properties.hba}</span>
                      <span>TPSA: {molecule.properties.tpsa.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMolecule(selectedMolecule === molecule.id ? null : molecule.id)}
                  >
                    {selectedMolecule === molecule.id ? 'Hide 3D' : 'View 3D'}
                  </Button>
                </div>
                
                {selectedMolecule === molecule.id && (
                  <MolecularVisualizer 
                    smiles={molecule.smiles}
                    properties={molecule.properties}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};