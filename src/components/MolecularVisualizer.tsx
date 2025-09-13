import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface MolecularVisualizerProps {
  smiles: string;
  properties: {
    mw: number;
    logp: number;
    hbd: number;
    hba: number;
    tpsa: number;
  };
}

export const MolecularVisualizer = ({ smiles, properties }: MolecularVisualizerProps) => {
  const [rotationX, setRotationX] = useState([0]);
  const [rotationY, setRotationY] = useState([0]);
  const [zoom, setZoom] = useState([1]);
  const [showBonds, setShowBonds] = useState(true);
  const [showHydrogens, setShowHydrogens] = useState(false);
  const [colorScheme, setColorScheme] = useState<'cpk' | 'element' | 'property'>('cpk');

  // Mock 3D structure representation (in real app, would use 3Dmol.js or similar)
  const renderMolecule = () => {
    const atoms = smiles.match(/[A-Z][a-z]?/g) || [];
    const bondCount = (smiles.match(/[-=#]/g) || []).length;
    
    return (
      <div 
        className="relative w-full h-64 bg-gradient-to-br from-background to-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden"
        style={{
          transform: `rotateX(${rotationX[0]}deg) rotateY(${rotationY[0]}deg) scale(${zoom[0]})`
        }}
      >
        {/* Mock molecular visualization */}
        <div className="grid grid-cols-4 gap-2 p-4">
          {atoms.slice(0, 12).map((atom, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                atom === 'C' ? 'bg-gray-600 text-white' :
                atom === 'N' ? 'bg-blue-500 text-white' :
                atom === 'O' ? 'bg-red-500 text-white' :
                atom === 'S' ? 'bg-yellow-500 text-black' :
                'bg-primary text-primary-foreground'
              }`}
              style={{
                transform: `rotate(${index * 30}deg)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {atom}
            </div>
          ))}
        </div>
        
        {/* Bond indicators */}
        {showBonds && (
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: bondCount }, (_, i) => (
              <div
                key={i}
                className="w-12 h-0.5 bg-muted-foreground/40 absolute"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gradient-card border shadow-molecular">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-card-foreground">3D Molecular Viewer</h4>
        <div className="flex gap-2">
          <Badge variant="outline">{smiles.length} chars</Badge>
          <Badge variant="secondary">{properties.mw.toFixed(1)} Da</Badge>
        </div>
      </div>

      {renderMolecule()}

      {/* Controls */}
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Rotation X: {rotationX[0]}°</label>
            <Slider
              value={rotationX}
              onValueChange={setRotationX}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Rotation Y: {rotationY[0]}°</label>
            <Slider
              value={rotationY}
              onValueChange={setRotationY}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Zoom: {zoom[0].toFixed(1)}x</label>
          <Slider
            value={zoom}
            onValueChange={setZoom}
            min={0.5}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="bonds"
              checked={showBonds}
              onCheckedChange={setShowBonds}
            />
            <label htmlFor="bonds" className="text-sm font-medium">Show Bonds</label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="hydrogens"
              checked={showHydrogens}
              onCheckedChange={setShowHydrogens}
            />
            <label htmlFor="hydrogens" className="text-sm font-medium">Show Hydrogens</label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={colorScheme === 'cpk' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColorScheme('cpk')}
          >
            CPK Colors
          </Button>
          <Button
            variant={colorScheme === 'element' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColorScheme('element')}
          >
            Element Colors
          </Button>
          <Button
            variant={colorScheme === 'property' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColorScheme('property')}
          >
            Property Colors
          </Button>
        </div>
      </div>
    </Card>
  );
};