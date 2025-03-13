
import React from 'react';
import { Card, Typography, Divider, Layout } from 'antd';
import MonetizationSettings from '../components/MonetizationSettings';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function AdminPage() {
  return (
    <Layout className="admin-layout">
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>Dexmond Admin</Title>
        <Paragraph>
          Manage your DEX settings and revenue options.
        </Paragraph>
        
        <Divider />
        
        <Title level={3}>Revenue Settings</Title>
        <Card>
          <MonetizationSettings />
        </Card>
        
        <Divider />
        
        <Title level={3}>API Configuration</Title>
        <Card>
          <Paragraph>
            Your DEX is using the 0x Swap API to find the best prices across DEXes.
            Trades executed through your interface can generate revenue through affiliate fees.
          </Paragraph>
          <Paragraph>
            <strong>Current API Key:</strong> [Hidden for security]
          </Paragraph>
        </Card>
        
        <Divider />
        
        <Title level={3}>Analytics</Title>
        <Card>
          <Paragraph>
            Connect your analytics provider to track trading volume and revenue.
            This feature will be available in a future update.
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}
