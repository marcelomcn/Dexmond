
import React, { useState, useEffect } from 'react';
import { Button, Input, Switch, Form, Card, Typography } from 'antd';
import { DollarOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function MonetizationSettings() {
  const [enabled, setEnabled] = useState(false);
  const [address, setAddress] = useState('');
  const [bps, setBps] = useState('50');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize from existing config
    const config = window.dexmond.getMonetizationConfig();
    setEnabled(config.enabled);
    setAddress(config.affiliateAddress);
    setBps(config.affiliateFeeBps);
  }, []);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    window.dexmond.enableMonetization(checked);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    window.dexmond.setAffiliateAddress(newAddress);
  };

  const handleBpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBps = e.target.value;
    setBps(newBps);
    window.dexmond.setAffiliateFeeBps(newBps);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="monetization-settings">
      <Button 
        icon={<SettingOutlined />} 
        onClick={toggleVisibility}
        type="text"
        size="small"
      >
        Monetization
      </Button>
      
      {isVisible && (
        <Card 
          title={<Title level={4}><DollarOutlined /> Revenue Settings</Title>}
          style={{ marginTop: '16px', width: '100%', maxWidth: '500px' }}
          className="monetization-card"
        >
          <Paragraph>
            Configure how you earn revenue from trades on your DEX. 
            Collect affiliate fees on swaps processed through the 0x API.
          </Paragraph>
          
          <Form layout="vertical">
            <Form.Item label="Enable Fee Collection">
              <Switch 
                checked={enabled} 
                onChange={handleToggle} 
                checkedChildren="On" 
                unCheckedChildren="Off"
              />
              <Text style={{ marginLeft: '12px' }}>
                {enabled ? 'Fee collection is active' : 'Fee collection is disabled'}
              </Text>
            </Form.Item>
            
            <Form.Item 
              label="Affiliate Address (Your Wallet)" 
              help="Ethereum address that will receive fees"
            >
              <Input 
                value={address} 
                onChange={handleAddressChange} 
                placeholder="0x..." 
                disabled={!enabled}
              />
            </Form.Item>
            
            <Form.Item 
              label="Fee Amount (basis points)" 
              help="100 basis points = 1% (recommended: 50 bps = 0.5%)"
            >
              <Input 
                type="number" 
                value={bps} 
                onChange={handleBpsChange} 
                min="0" 
                max="100" 
                disabled={!enabled}
              />
            </Form.Item>
          </Form>
          
          <Paragraph type="secondary">
            Note: Setting fees too high may result in worse price execution for users.
            Consider keeping fees below 1% (100 bps) for best results.
          </Paragraph>
        </Card>
      )}
    </div>
  );
}
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
                  onChange={(e) => handleInputChange('affiliateFeeRecipient', e.target.value)}
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
                  onChange={(e) => handleInputChange('affiliateFeeBps', e.target.value)}
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
                  onChange={(e) => handleInputChange('positiveSlippageRecipient', e.target.value)}
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
