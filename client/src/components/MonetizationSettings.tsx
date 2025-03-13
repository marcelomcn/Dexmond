import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MonetizationConfig, defaultMonetizationConfig } from "@/lib/monetization";

interface MonetizationSettingsProps {
  config: MonetizationConfig;
  onConfigChange: (config: MonetizationConfig) => void;
}

export function MonetizationSettings({ config, onConfigChange }: MonetizationSettingsProps) {
  const [localConfig, setLocalConfig] = useState<MonetizationConfig>(config);

  const handleSwitchChange = (field: keyof MonetizationConfig) => {
    const newConfig = { ...localConfig, [field]: !localConfig[field as keyof MonetizationConfig] };
    setLocalConfig(newConfig);
  };

  const handleInputChange = (field: keyof MonetizationConfig, value: string) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  const handleReset = () => {
    setLocalConfig(defaultMonetizationConfig);
    onConfigChange(defaultMonetizationConfig);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monetization Settings</CardTitle>
        <CardDescription>
          Configure how you want to monetize swaps on your DEX.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Affiliate Fee Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Collect Affiliate Fees</h3>
              <p className="text-sm text-muted-foreground">
                Earn a percentage fee on each swap transaction.
              </p>
            </div>
            <Switch
              checked={localConfig.collectAffiliateFee}
              onCheckedChange={() => handleSwitchChange('collectAffiliateFee')}
            />
          </div>

          {localConfig.collectAffiliateFee && (
            <div className="grid gap-4 pl-4 border-l-2 border-primary/20 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="affiliateFeeRecipient">Fee Recipient Address</Label>
                <Input
                  id="affiliateFeeRecipient"
                  value={localConfig.affiliateFeeRecipient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('affiliateFeeRecipient', e.target.value)
                  }
                  placeholder="0x..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="affiliateFeeBps">
                  Fee Percentage (in basis points, 100 = 1%)
                </Label>
                <Input
                  id="affiliateFeeBps"
                  value={localConfig.affiliateFeeBps}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('affiliateFeeBps', e.target.value)
                  }
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Positive Slippage Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Collect Positive Slippage</h3>
              <p className="text-sm text-muted-foreground">
                Capture price improvements that occur between quote and execution.
              </p>
            </div>
            <Switch
              checked={localConfig.collectPositiveSlippage}
              onCheckedChange={() => handleSwitchChange('collectPositiveSlippage')}
            />
          </div>

          {localConfig.collectPositiveSlippage && (
            <div className="grid gap-4 pl-4 border-l-2 border-primary/20 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="positiveSlippageRecipient">Slippage Recipient Address</Label>
                <Input
                  id="positiveSlippageRecipient"
                  value={localConfig.positiveSlippageRecipient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('positiveSlippageRecipient', e.target.value)
                  }
                  placeholder="0x..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}