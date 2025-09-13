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

  // Get color based on color scheme
  const getAtomColor = (atom: string, index: number) => {
    switch (colorScheme) {
      case 'cpk':
        return atom === 'C' ? 'bg-zinc-600 text-white border-zinc-400' :
               atom === 'N' ? 'bg-blue-600 text-white border-blue-400' :
               atom === 'O' ? 'bg-red-600 text-white border-red-400' :
               atom === 'S' ? 'bg-yellow-500 text-black border-yellow-300' :
               atom === 'P' ? 'bg-orange-600 text-white border-orange-400' :
               atom === 'F' ? 'bg-green-500 text-white border-green-300' :
               atom === 'Cl' ? 'bg-green-600 text-white border-green-400' :
               atom === 'Br' ? 'bg-amber-700 text-white border-amber-500' :
               'bg-primary text-primary-foreground border-primary/60';
      case 'element':
        const elementColors = ['bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500'];
        return `${elementColors[index % elementColors.length]} text-white border-white/30`;
      case 'property':
        const mwColor = properties.mw > 300 ? 'bg-red-500' : properties.mw > 200 ? 'bg-orange-500' : 'bg-green-500';
        return `${mwColor} text-white border-white/30`;
      default:
        return 'bg-primary text-primary-foreground border-primary/60';
    }
  };

  // Enhanced 2D molecular structure visualization
  const renderMolecule = () => {
    const atoms = smiles.match(/[A-Z][a-z]?/g) || [];
    const bondCount = (smiles.match(/[-=#]/g) || []).length;
    
    // Count atoms
    const atomCounts: Record<string, number> = {};
    atoms.forEach(atom => {
      atomCounts[atom] = (atomCounts[atom] || 0) + 1;
    });
    
    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-background via-background/80 to-muted/30 rounded-lg border border-border overflow-hidden">
        <div 
          className="w-full h-full flex items-center justify-center p-4 transition-transform duration-300"
          style={{ 
            transform: `scale(${zoom[0]}) rotateX(${rotationX[0]}deg) rotateY(${rotationY[0]}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 2D Molecular Structure Layout */}
          <div className="relative">
            {/* Central molecular backbone */}
            <div className="flex items-center space-x-3">
              {atoms.slice(0, 8).map((atom, index) => {
                const isRingAtom = index % 3 === 0;
                const yOffset = isRingAtom ? -20 : index % 2 === 0 ? 0 : 20;
                
                return (
                  <div key={index} className="relative">
                    {/* Bonds */}
                    {showBonds && index < atoms.length - 1 && (
                      <div className="absolute left-8 top-1/2 w-6 h-0.5 bg-foreground/60 -translate-y-1/2 z-0" />
                    )}
                    
                    {/* Atom */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 hover:scale-110 ${getAtomColor(atom, index)}`}
                      style={{
                        transform: `translateY(${yOffset}px)`,
                      }}
                    >
                      {atom}
                    </div>
                    
                    {/* Hydrogen indicators */}
                    {showHydrogens && atom === 'C' && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        H₃
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Ring structures for complex molecules */}
            {atoms.length > 6 && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="relative w-20 h-20">
                  {Array.from({ length: 6 }, (_, i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const x = Math.cos(angle) * 30;
                    const y = Math.sin(angle) * 30;
                    
                    return (
                      <div
                        key={i}
                        className="absolute w-6 h-6 rounded-full bg-zinc-500 border border-zinc-400 flex items-center justify-center text-xs text-white"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        C
                      </div>
                    );
                  })}
                  
                  {/* Ring bonds */}
                  {showBonds && (
                    <svg className="absolute inset-0 w-full h-full">
                      {Array.from({ length: 6 }, (_, i) => {
                        const angle1 = (i * 60) * (Math.PI / 180);
                        const angle2 = ((i + 1) * 60) * (Math.PI / 180);
                        const x1 = 50 + Math.cos(angle1) * 40;
                        const y1 = 50 + Math.sin(angle1) * 40;
                        const x2 = 50 + Math.cos(angle2) * 40;
                        const y2 = 50 + Math.sin(angle2) * 40;
                        
                        return (
                          <line
                            key={i}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-foreground/60"
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Molecular formula overlay */}
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
          {Object.entries(atomCounts).map(([atom, count]) => (
            <span key={atom} className="mr-1">
              {atom}{count > 1 && <sub>{count}</sub>}
            </span>
          ))}
        </div>
        
        {/* SMILES string overlay */}
        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono max-w-[200px] truncate">
          {smiles}
        </div>
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