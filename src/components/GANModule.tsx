import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface TrainingMetrics {
  epoch: number;
  generatorLoss: number;
  discriminatorLoss: number;
  fid: number;
  validity: number;
}

const mockTrainingData: TrainingMetrics[] = [
  { epoch: 1, generatorLoss: 2.45, discriminatorLoss: 1.23, fid: 45.2, validity: 0.67 },
  { epoch: 50, generatorLoss: 1.82, discriminatorLoss: 0.95, fid: 32.1, validity: 0.78 },
  { epoch: 100, generatorLoss: 1.34, discriminatorLoss: 0.87, fid: 24.5, validity: 0.85 },
  { epoch: 150, generatorLoss: 0.95, discriminatorLoss: 0.92, fid: 18.7, validity: 0.91 },
  { epoch: 200, generatorLoss: 0.73, discriminatorLoss: 0.88, fid: 15.2, validity: 0.94 }
];

export const GANModule = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingMetrics[]>([]);
  const [convergenceStatus, setConvergenceStatus] = useState<'stable' | 'diverging' | 'converging'>('stable');
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
          
          <Badge variant={convergenceStatus === 'converging' ? 'default' : convergenceStatus === 'stable' ? 'secondary' : 'destructive'}>
            {convergenceStatus === 'converging' ? '📈 Converging' : 
             convergenceStatus === 'stable' ? '🔄 Stable' : '📉 Diverging'}
          </Badge>
        </div>

        {/* Training Controls */}
        <div className="flex gap-4 mb-6">
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
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Epoch {currentEpoch}/200</span>
              <span className="text-sm text-muted-foreground">{((currentEpoch / 200) * 100).toFixed(1)}% Complete</span>
            </div>
            <Progress value={(currentEpoch / 200) * 100} className="w-full mb-4" />
            
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
                  <div className="text-sm text-muted-foreground">FID: {entry.fid.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Architecture Info */}
      <Card className="p-6 bg-card border shadow-molecular">
        <h3 className="text-xl font-bold text-card-foreground mb-4">Network Architecture</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-secondary mb-2">Generator Network</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Input: Random noise vector (100D)</li>
              <li>• Hidden: 4 fully connected layers</li>
              <li>• Activation: LeakyReLU + BatchNorm</li>
              <li>• Output: SMILES token probabilities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-2">Discriminator Network</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Input: SMILES sequences</li>
              <li>• Embedding: Character-level encoding</li>
              <li>• Hidden: LSTM + attention layers</li>
              <li>• Output: Real/fake probability</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};