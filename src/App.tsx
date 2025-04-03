import React from 'react';
import { Layout, Typography } from 'antd';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import CreateTicket from './components/CreateTicket';
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Aptos Ticket System</Title>
        <WalletSelector />
      </Header>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <CreateTicket />
      </Content>
    </Layout>
  );
};

export default App; 