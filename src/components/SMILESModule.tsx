import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MolecularVisualizer } from "./MolecularVisualizer";
import { PropertyFilter, FilterCriteria } from "./PropertyFilter";
import { Download, Upload, Zap, Search } from "lucide-react";

interface SMILESAnalysis {
  smiles: string;
  isValid: boolean;
  molecularWeight: number;
  atomCount: number;
  bondCount: number;
  rings: number;
  aromaticRings: number;
  heteroatoms: number;
  rotatable: number;
  formula: string;
  lipinski: {
    mw: boolean;
    logp: boolean;
    hbd: boolean;
    hba: boolean;
    violations: number;
  };
}

const sampleMolecules = [
  "CC(=O)OC1=CC=CC=C1C(=O)O", // Aspirin
  "CN1CCN(CC1)C2=CC=C(C=C2)OC", // Sample drug-like
  "CC1=CC=C(C=C1)S(=O)(=O)NC2=CC=CC=N2", // Sulfonamide
  "C1=CC=C(C=C1)C2=CC=CC=C2", // Biphenyl
  "O=C(O)CCCCCCCCCCCCCCC", // Palmitic acid
];

export const SMILESModule = () => {
  const [inputSMILES, setInputSMILES] = useState("");
  const [analysis, setAnalysis] = useState<SMILESAnalysis | null>(null);
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState<SMILESAnalysis[]>([]);
  const [filteredResults, setFilteredResults] = useState<SMILESAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Analysis settings
  const [includeDescriptors, setIncludeDescriptors] = useState(true);
  const [checkSimilarity, setCheckSimilarity] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState([0.7]);
  
  const { toast } = useToast();

  const mockAnalyzeSMILES = (smiles: string): SMILESAnalysis => {
    // Mock analysis - in real implementation, this would use RDKit
    const atomCount = Math.floor(Math.random() * 50) + 10;
    const mw = Math.floor(Math.random() * 400) + 150;
    
    return {
      smiles,
      isValid: smiles.length > 5 && !smiles.includes("X"), // Simple validation
      molecularWeight: mw,
      atomCount,
      bondCount: Math.floor(atomCount * 1.2),
      rings: Math.floor(Math.random() * 4),
      aromaticRings: Math.floor(Math.random() * 3),
      heteroatoms: Math.floor(Math.random() * 8),
      rotatable: Math.floor(Math.random() * 10),
      formula: `C${Math.floor(atomCount * 0.6)}H${Math.floor(atomCount * 0.8)}N${Math.floor(Math.random() * 3)}O${Math.floor(Math.random() * 5)}`,
      lipinski: {
        mw: mw <= 500,
        logp: true, // Mock as passing
        hbd: Math.random() > 0.3,
        hba: Math.random() > 0.2,
        violations: Math.floor(Math.random() * 3)
      }
    };
  };

  const analyzeSingle = async () => {
    if (!inputSMILES.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SMILES string",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = mockAnalyzeSMILES(inputSMILES.trim());
    setAnalysis(result);
    setIsAnalyzing(false);

    toast({
      title: result.isValid ? "Analysis Complete" : "Invalid SMILES",
      description: result.isValid 
        ? `Molecular weight: ${result.molecularWeight.toFixed(1)} Da`
        : "The SMILES string appears to be invalid",
      variant: result.isValid ? "default" : "destructive",
    });
  };

  const analyzeBatch = async () => {
    if (!batchInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter SMILES strings (one per line)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    const smilesList = batchInput.trim().split('\n').filter(s => s.trim());
    const results: SMILESAnalysis[] = [];

    for (const smiles of smilesList) {
      await new Promise(resolve => setTimeout(resolve, 500));
      results.push(mockAnalyzeSMILES(smiles.trim()));
    }

    setBatchResults(results);
    setIsAnalyzing(false);

    const validCount = results.filter(r => r.isValid).length;
    toast({
      title: "Batch Analysis Complete",
      description: `Analyzed ${results.length} molecules, ${validCount} valid`,
    });
  };

  const loadSample = (smiles: string) => {
    setInputSMILES(smiles);
  };

  const handleFilterChange = (criteria: FilterCriteria) => {
    const filtered = batchResults.filter(result => {
      const mw = result.molecularWeight;
      return (
        mw >= criteria.mwRange[0] && mw <= criteria.mwRange[1] &&
        result.heteroatoms <= criteria.hbaMax &&
        result.lipinski.violations <= (criteria.lipinskiCompliant ? 0 : 4)
      );
    });
    setFilteredResults(filtered);
  };

  const exportResults = () => {
    if (batchResults.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Analyze some molecules first before exporting",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = batchResults.map(result => ({
        SMILES: result.smiles,
        Valid: result.isValid,
        MolecularWeight: result.molecularWeight,
        Formula: result.formula,
        Atoms: result.atomCount,
        Bonds: result.bondCount,
        Rings: result.rings,
        AromaticRings: result.aromaticRings,
        Heteroatoms: result.heteroatoms,
        RotatableBonds: result.rotatable,
        LipinskiViolations: result.lipinski.violations
      }));
      
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smiles_analysis_results.csv';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Exported ${data.length} analysis results to CSV file`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  const findSimilarMolecules = (targetSmiles: string) => {
    // Mock similarity search
    const similar = batchResults.filter(result => 
      result.smiles !== targetSmiles && 
      result.molecularWeight > analysis!.molecularWeight * 0.8 &&
      result.molecularWeight < analysis!.molecularWeight * 1.2
    );
    
    toast({
      title: "Similarity Search",
      description: `Found ${similar.length} potentially similar molecules`,
    });
    
    return similar;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-0 shadow-molecular">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent-light rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🧪</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">SMILES Analyzer</h2>
            <p className="text-muted-foreground">Parse and analyze molecular structures from SMILES notation</p>
          </div>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single">Single Analysis</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                SMILES String
              </label>
              <Input
                value={inputSMILES}
                onChange={(e) => setInputSMILES(e.target.value)}
                placeholder="Enter SMILES notation (e.g., CC(=O)OC1=CC=CC=C1C(=O)O)"
                className="font-mono"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Quick samples:</span>
              {sampleMolecules.slice(0, 3).map((smiles, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample(smiles)}
                  className="text-xs font-mono"
                >
                  {smiles.slice(0, 15)}...
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="descriptors"
                  checked={includeDescriptors}
                  onCheckedChange={setIncludeDescriptors}
                />
                <label htmlFor="descriptors" className="text-sm font-medium">
                  Include Molecular Descriptors
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="similarity"
                  checked={checkSimilarity}
                  onCheckedChange={setCheckSimilarity}
                />
                <label htmlFor="similarity" className="text-sm font-medium">
                  Check Database Similarity
                </label>
              </div>
            </div>

            {checkSimilarity && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Similarity Threshold: {similarityThreshold[0].toFixed(2)}
                </label>
                <Slider
                  value={similarityThreshold}
                  onValueChange={setSimilarityThreshold}
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
              </div>
            )}

            <Button 
              onClick={analyzeSingle}
              disabled={isAnalyzing}
              variant="scientific"
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze SMILES"}
            </Button>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                SMILES Strings (one per line)
              </label>
              <Textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder="Enter multiple SMILES strings, one per line..."
                rows={6}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button variant="outline" size="sm" onClick={() => setBatchInput(sampleMolecules.join('\n'))}>
                Load Samples
              </Button>
            </div>

            <Button 
              onClick={analyzeBatch}
              disabled={isAnalyzing}
              variant="scientific"
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Processing Batch..." : "Analyze Batch"}
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Molecular Comparison</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Compare two molecules for structural similarity
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Start Comparison
                </Button>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Substructure Search</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Find molecules containing specific substructures
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Search Substructures
                </Button>
              </Card>
            </div>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Molecular Fingerprints</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Generate molecular fingerprints for similarity analysis
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Morgan</Button>
                <Button variant="outline" size="sm">MACCS</Button>
                <Button variant="outline" size="sm">RDKit</Button>
                <Button variant="outline" size="sm">AtomPair</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Single Analysis Results */}
      {analysis && (
        <Card className="p-6 bg-card border shadow-molecular">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-card-foreground">Analysis Results</h3>
            <div className="flex gap-2">
              <Badge variant={analysis.isValid ? "default" : "destructive"}>
                {analysis.isValid ? "✓ Valid" : "✗ Invalid"}
              </Badge>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">SMILES</div>
              <code className="text-sm font-mono text-primary">{analysis.smiles}</code>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMolecule(selectedMolecule === analysis.smiles ? null : analysis.smiles)}
                >
                  {selectedMolecule === analysis.smiles ? 'Hide 3D' : 'View 3D'}
                </Button>
                {checkSimilarity && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => findSimilarMolecules(analysis.smiles)}
                  >
                    Find Similar
                  </Button>
                )}
              </div>
            </div>

            {selectedMolecule === analysis.smiles && (
              <MolecularVisualizer 
                smiles={analysis.smiles}
                properties={{
                  mw: analysis.molecularWeight,
                  logp: 2.1, // Mock value
                  hbd: 1,
                  hba: 4,
                  tpsa: 63.6
                }}
              />
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center bg-primary-light p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary">{analysis.molecularWeight.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Molecular Weight (Da)</div>
              </div>
              <div className="text-center bg-secondary-light p-3 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{analysis.atomCount}</div>
                <div className="text-sm text-muted-foreground">Atoms</div>
              </div>
              <div className="text-center bg-accent-light p-3 rounded-lg">
                <div className="text-2xl font-bold text-accent">{analysis.rings}</div>
                <div className="text-sm text-muted-foreground">Rings</div>
              </div>
              <div className="text-center bg-muted p-3 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{analysis.rotatable}</div>
                <div className="text-sm text-muted-foreground">Rotatable Bonds</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-card-foreground mb-2">Lipinski Rule of Five</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant={analysis.lipinski.mw ? "default" : "destructive"}>
                  MW ≤ 500: {analysis.lipinski.mw ? "Pass" : "Fail"}
                </Badge>
                <Badge variant={analysis.lipinski.logp ? "default" : "destructive"}>
                  LogP ≤ 5: {analysis.lipinski.logp ? "Pass" : "Fail"}
                </Badge>
                <Badge variant={analysis.lipinski.hbd ? "default" : "destructive"}>
                  HBD ≤ 5: {analysis.lipinski.hbd ? "Pass" : "Fail"}
                </Badge>
                <Badge variant={analysis.lipinski.hba ? "default" : "destructive"}>
                  HBA ≤ 10: {analysis.lipinski.hba ? "Pass" : "Fail"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Violations: {analysis.lipinski.violations}/4
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Batch Results */}
      {batchResults.length > 0 && (
        <Card className="p-6 bg-card border shadow-molecular">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-card-foreground">Batch Results</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6">
              <PropertyFilter 
                onFilterChange={handleFilterChange}
                moleculeCount={batchResults.length}
                filteredCount={filteredResults.length}
              />
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(showFilters ? filteredResults : batchResults).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono text-primary block truncate">
                    {result.smiles}
                  </code>
                  <div className="text-xs text-muted-foreground">
                    MW: {result.molecularWeight.toFixed(1)} | Atoms: {result.atomCount} | 
                    Violations: {result.lipinski.violations}
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <Badge variant={result.isValid ? "default" : "destructive"}>
                    {result.isValid ? "Valid" : "Invalid"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMolecule(selectedMolecule === result.smiles ? null : result.smiles)}
                  >
                    {selectedMolecule === result.smiles ? 'Hide' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};