import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MolecularVisualizer } from "./MolecularVisualizer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TrainingMetrics {
  epoch: number;
  generatorLoss: number;
  discriminatorLoss: number;
  fid: number;
  validity: number;
  diversity?: number;
  uniqueness?: number;
}

interface GANConfig {
  generatorLayers: number;
  discriminatorLayers: number;
  latentDim: number;
  learningRate: number;
  batchSize: number;
  discriminatorSteps: number;
  generatorSteps: number;
  weightClipping: number;
}

const mockTrainingData: TrainingMetrics[] = [
  { epoch: 1, generatorLoss: 2.45, discriminatorLoss: 1.23, fid: 45.2, validity: 0.67, diversity: 0.45, uniqueness: 0.82 },
  { epoch: 50, generatorLoss: 1.82, discriminatorLoss: 0.95, fid: 32.1, validity: 0.78, diversity: 0.62, uniqueness: 0.89 },
  { epoch: 100, generatorLoss: 1.34, discriminatorLoss: 0.87, fid: 24.5, validity: 0.85, diversity: 0.71, uniqueness: 0.91 },
  { epoch: 150, generatorLoss: 0.95, discriminatorLoss: 0.92, fid: 18.7, validity: 0.91, diversity: 0.76, uniqueness: 0.94 },
  { epoch: 200, generatorLoss: 0.73, discriminatorLoss: 0.88, fid: 15.2, validity: 0.94, diversity: 0.81, uniqueness: 0.96 }
];

export const GANModule = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingMetrics[]>([]);
  const [convergenceStatus, setConvergenceStatus] = useState<'stable' | 'diverging' | 'converging'>('stable');
  
  // GAN Configuration
  const [ganConfig, setGanConfig] = useState<GANConfig>({
    generatorLayers: 4,
    discriminatorLayers: 3,
    latentDim: 100,
    learningRate: 0.0002,
    batchSize: 64,
    discriminatorSteps: 1,
    generatorSteps: 1,
    weightClipping: 0.01
  });
  
  // Interactive Features
  const [showMetricsChart, setShowMetricsChart] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'fid' | 'validity' | 'diversity'>('loss');
  const [autoOptimize, setAutoOptimize] = useState(false);
  
  const { toast } = useToast();

  const startTraining = async () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingHistory([]);
    setMetrics(null);

    toast({
      title: "GAN Training Started",
      description: "Initializing generator and discriminator networks...",
    });

    // Simulate training process
    for (let i = 0; i < mockTrainingData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentMetrics = mockTrainingData[i];
      setCurrentEpoch(currentMetrics.epoch);
      setMetrics(currentMetrics);
      setTrainingHistory(prev => [...prev, currentMetrics]);

      // Determine convergence status
      if (i > 0) {
        const prevMetrics = mockTrainingData[i - 1];
        const lossImprovement = prevMetrics.generatorLoss - currentMetrics.generatorLoss;
        if (lossImprovement > 0.1) {
          setConvergenceStatus('converging');
        } else if (lossImprovement < -0.1) {
          setConvergenceStatus('diverging');
        } else {
          setConvergenceStatus('stable');
        }
      }

      toast({
        title: `Epoch ${currentMetrics.epoch} Complete`,
        description: `Generator Loss: ${currentMetrics.generatorLoss}, Validity: ${(currentMetrics.validity * 100).toFixed(1)}%`,
      });
    }

    setIsTraining(false);
    toast({
      title: "Training Complete",
      description: "GAN model successfully trained and ready for molecular generation",
    });
  };

  const stopTraining = () => {
    setIsTraining(false);
    toast({
      title: "Training Stopped",
      description: "Training process interrupted by user",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-0 shadow-molecular">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary-light rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚔️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">Generative Adversarial Network (GAN)</h2>
              <p className="text-muted-foreground">Adversarial training for high-quality molecular generation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={convergenceStatus === 'converging' ? 'default' : convergenceStatus === 'stable' ? 'secondary' : 'destructive'}>
              {convergenceStatus === 'converging' ? '📈 Converging' : 
               convergenceStatus === 'stable' ? '🔄 Stable' : '📉 Diverging'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMetricsChart(!showMetricsChart)}
            >
              {showMetricsChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Network Architecture</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Generator Layers: {ganConfig.generatorLayers}
                    </label>
                    <Slider
                      value={[ganConfig.generatorLayers]}
                      onValueChange={(value) => setGanConfig({...ganConfig, generatorLayers: value[0]})}
                      min={2}
                      max={8}
                      step={1}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Discriminator Layers: {ganConfig.discriminatorLayers}
                    </label>
                    <Slider
                      value={[ganConfig.discriminatorLayers]}
                      onValueChange={(value) => setGanConfig({...ganConfig, discriminatorLayers: value[0]})}
                      min={2}
                      max={6}
                      step={1}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Latent Dimensions: {ganConfig.latentDim}
                    </label>
                    <Slider
                      value={[ganConfig.latentDim]}
                      onValueChange={(value) => setGanConfig({...ganConfig, latentDim: value[0]})}
                      min={50}
                      max={512}
                      step={10}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground mb-4">Training Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Learning Rate: {ganConfig.learningRate.toFixed(4)}
                    </label>
                    <Slider
                      value={[ganConfig.learningRate]}
                      onValueChange={(value) => setGanConfig({...ganConfig, learningRate: value[0]})}
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Batch Size: {ganConfig.batchSize}
                    </label>
                    <Slider
                      value={[ganConfig.batchSize]}
                      onValueChange={(value) => setGanConfig({...ganConfig, batchSize: value[0]})}
                      min={16}
                      max={256}
                      step={16}
                      className="w-full"
                      disabled={isTraining}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-optimize"
                      checked={autoOptimize}
                      onCheckedChange={setAutoOptimize}
                      disabled={isTraining}
                    />
                    <label htmlFor="auto-optimize" className="text-sm font-medium">
                      Auto-optimize Parameters
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6 mt-6">
            {/* Training Controls */}
            <div className="flex gap-4">
              <Button 
                onClick={startTraining}
                disabled={isTraining}
                variant="scientific"
                size="lg"
              >
                {isTraining ? "Training in Progress..." : "Start GAN Training"}
              </Button>
              
              {isTraining && (
                <Button 
                  onClick={stopTraining}
                  variant="destructive"
                  size="lg"
                >
                  Stop Training
                </Button>
              )}
            </div>

            {/* Training Progress */}
            {isTraining && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Epoch {currentEpoch}/200</span>
                  <span className="text-sm text-muted-foreground">{((currentEpoch / 200) * 100).toFixed(1)}% Complete</span>
                </div>
                <Progress value={(currentEpoch / 200) * 100} className="w-full" />
                
                {metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-primary-light rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Generator Loss</div>
                      <div className="text-lg font-bold text-primary">{metrics.generatorLoss.toFixed(3)}</div>
                    </div>
                    <div className="bg-secondary-light rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Discriminator Loss</div>
                      <div className="text-lg font-bold text-secondary">{metrics.discriminatorLoss.toFixed(3)}</div>
                    </div>
                    <div className="bg-accent-light rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">FID Score</div>
                      <div className="text-lg font-bold text-accent">{metrics.fid.toFixed(1)}</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Validity</div>
                      <div className="text-lg font-bold text-foreground">{(metrics.validity * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 mt-6">
            {showMetricsChart && trainingHistory.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Training Metrics</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedMetric === 'loss' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetric('loss')}
                    >
                      Loss
                    </Button>
                    <Button
                      variant={selectedMetric === 'fid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetric('fid')}
                    >
                      FID
                    </Button>
                    <Button
                      variant={selectedMetric === 'validity' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetric('validity')}
                    >
                      Validity
                    </Button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    {selectedMetric === 'loss' && (
                      <>
                        <Line type="monotone" dataKey="generatorLoss" stroke="#3b82f6" name="Generator Loss" />
                        <Line type="monotone" dataKey="discriminatorLoss" stroke="#ef4444" name="Discriminator Loss" />
                      </>
                    )}
                    {selectedMetric === 'fid' && (
                      <Line type="monotone" dataKey="fid" stroke="#10b981" name="FID Score" />
                    )}
                    {selectedMetric === 'validity' && (
                      <Line type="monotone" dataKey="validity" stroke="#8b5cf6" name="Validity" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Additional Metrics */}
            {trainingHistory.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Validity:</span>
                      <span className="text-sm font-medium">{((metrics?.validity || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Diversity:</span>
                      <span className="text-sm font-medium">{((metrics?.diversity || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Uniqueness:</span>
                      <span className="text-sm font-medium">{((metrics?.uniqueness || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Training Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Epochs Completed:</span>
                      <span className="text-sm font-medium">{currentEpoch}/200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Convergence:</span>
                      <Badge variant={convergenceStatus === 'converging' ? 'default' : convergenceStatus === 'stable' ? 'secondary' : 'destructive'}>
                        {convergenceStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best FID Score:</span>
                      <span className="text-sm font-medium">
                        {Math.min(...trainingHistory.map(h => h.fid)).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-secondary mb-2">Generator Network</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Input: Random noise vector ({ganConfig.latentDim}D)</li>
                  <li>• Hidden: {ganConfig.generatorLayers} fully connected layers</li>
                  <li>• Activation: LeakyReLU + BatchNorm</li>
                  <li>• Output: SMILES token probabilities</li>
                  <li>• Learning Rate: {ganConfig.learningRate}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Discriminator Network</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Input: SMILES sequences</li>
                  <li>• Embedding: Character-level encoding</li>
                  <li>• Hidden: {ganConfig.discriminatorLayers} LSTM + attention layers</li>
                  <li>• Output: Real/fake probability</li>
                  <li>• Batch Size: {ganConfig.batchSize}</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Training History */}
      {trainingHistory.length > 0 && (
        <Card className="p-6 bg-card border shadow-molecular">
          <h3 className="text-xl font-bold text-card-foreground mb-4">Training History</h3>
          <div className="space-y-4">
            {trainingHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {entry.epoch}
                  </div>
                  <div>
                    <div className="font-semibold">Epoch {entry.epoch}</div>
                    <div className="text-sm text-muted-foreground">
                      G-Loss: {entry.generatorLoss.toFixed(3)} | D-Loss: {entry.discriminatorLoss.toFixed(3)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-accent">{(entry.validity * 100).toFixed(1)}% Valid</div>
                  <div className="text-sm text-muted-foreground">FID: {entry.fid.toFixed(1)} | Diversity: {((entry.diversity || 0) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};