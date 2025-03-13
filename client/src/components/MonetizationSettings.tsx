
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
