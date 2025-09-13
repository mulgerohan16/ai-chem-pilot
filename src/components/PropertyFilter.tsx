import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface FilterCriteria {
  mwRange: [number, number];
  logpRange: [number, number];
  hbdMax: number;
  hbaMax: number;
  tpsaRange: [number, number];
  lipinskiCompliant: boolean;
  qedMin: number;
  sasMax: number;
}

interface PropertyFilterProps {
  onFilterChange: (criteria: FilterCriteria) => void;
  moleculeCount: number;
  filteredCount: number;
}

export const PropertyFilter = ({ onFilterChange, moleculeCount, filteredCount }: PropertyFilterProps) => {
  const [mwRange, setMwRange] = useState<number[]>([0, 1000]);
  const [logpRange, setLogpRange] = useState<number[]>([-5, 5]);
  const [hbdMax, setHbdMax] = useState<number[]>([10]);
  const [hbaMax, setHbaMax] = useState<number[]>([20]);
  const [tpsaRange, setTpsaRange] = useState<number[]>([0, 200]);
  const [lipinskiCompliant, setLipinskiCompliant] = useState(false);
  const [qedMin, setQedMin] = useState<number[]>([0]);
  const [sasMax, setSasMax] = useState<number[]>([10]);

  const applyFilters = () => {
    const criteria: FilterCriteria = {
      mwRange: [mwRange[0], mwRange[1]],
      logpRange: [logpRange[0], logpRange[1]],
      hbdMax: hbdMax[0],
      hbaMax: hbaMax[0],
      tpsaRange: [tpsaRange[0], tpsaRange[1]],
      lipinskiCompliant,
      qedMin: qedMin[0],
      sasMax: sasMax[0]
    };
    onFilterChange(criteria);
  };

  const resetFilters = () => {
    setMwRange([0, 1000]);
    setLogpRange([-5, 5]);
    setHbdMax([10]);
    setHbaMax([20]);
    setTpsaRange([0, 200]);
    setLipinskiCompliant(false);
    setQedMin([0]);
    setSasMax([10]);
  };

  return (
    <Card className="p-6 bg-gradient-card border shadow-molecular">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-card-foreground">Property Filters</h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {moleculeCount} molecules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="scientific" size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Molecular Weight */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Molecular Weight: {mwRange[0]} - {mwRange[1]} Da
          </label>
          <Slider
            value={mwRange}
            onValueChange={setMwRange}
            min={0}
            max={1000}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0 Da</span>
            <span>1000 Da</span>
          </div>
        </div>

        {/* LogP */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            LogP (Lipophilicity): {logpRange[0]} - {logpRange[1]}
          </label>
          <Slider
            value={logpRange}
            onValueChange={setLogpRange}
            min={-5}
            max={5}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>-5</span>
            <span>5</span>
          </div>
        </div>

        <Separator />

        {/* Hydrogen Bond Donors/Acceptors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-3 block">
              H-Bond Donors (Max): {hbdMax[0]}
            </label>
            <Slider
              value={hbdMax}
              onValueChange={setHbdMax}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-3 block">
              H-Bond Acceptors (Max): {hbaMax[0]}
            </label>
            <Slider
              value={hbaMax}
              onValueChange={setHbaMax}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* TPSA */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            TPSA (Topological Polar Surface Area): {tpsaRange[0]} - {tpsaRange[1]} Ų
          </label>
          <Slider
            value={tpsaRange}
            onValueChange={setTpsaRange}
            min={0}
            max={200}
            step={5}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Advanced Filters */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">
              QED (Drug-likeness): {qedMin[0].toFixed(2)}+
            </label>
            <Slider
              value={qedMin}
              onValueChange={setQedMin}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">
              SAS (Synthetic Accessibility): {sasMax[0]}
            </label>
            <Slider
              value={sasMax}
              onValueChange={setSasMax}
              min={1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="lipinski"
              checked={lipinskiCompliant}
              onCheckedChange={setLipinskiCompliant}
            />
            <label htmlFor="lipinski" className="text-sm font-medium">
              Lipinski Rule of Five Compliant Only
            </label>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {mwRange[0] > 0 || mwRange[1] < 1000 ? (
              <Badge variant="secondary">MW: {mwRange[0]}-{mwRange[1]}</Badge>
            ) : null}
            {logpRange[0] > -5 || logpRange[1] < 5 ? (
              <Badge variant="secondary">LogP: {logpRange[0]}-{logpRange[1]}</Badge>
            ) : null}
            {hbdMax[0] < 10 ? (
              <Badge variant="secondary">HBD ≤ {hbdMax[0]}</Badge>
            ) : null}
            {hbaMax[0] < 20 ? (
              <Badge variant="secondary">HBA ≤ {hbaMax[0]}</Badge>
            ) : null}
            {qedMin[0] > 0 ? (
              <Badge variant="secondary">QED ≥ {qedMin[0].toFixed(2)}</Badge>
            ) : null}
            {lipinskiCompliant ? (
              <Badge variant="default">Lipinski</Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};