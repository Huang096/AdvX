import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import App from './App.jsx' // We will now use the router's structure
import { RouterProvider } from 'react-router-dom'
import router from './components/router/Router'
// import AuthProvider from './components/providers/AuthProvider' // 1. Remove this import

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

// 添加 Injective EVM 测试网配置
const injectiveTestnet = {
  id: 1439,
  name: 'Injective EVM Testnet',
  network: 'injective-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Injective',
    symbol: 'INJ',
  },
  rpcUrls: {
    public: { http: ['https://k8s.testnet.json-rpc.injective.network/'] },
    default: { http: ['https://k8s.testnet.json-rpc.injective.network/'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet.blockscout.injective.network/' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'WHO\'S YOUR MASTER',
  projectId: 'a671fe9e58f0db6ec65ba3aaa32e0315', // 请在这里替换为从 WalletConnect Cloud 复制的完整ID
  chains: [injectiveTestnet], // <-- 只保留 Injective 测试网
  ssr: true, // If your dApp uses server side rendering (SSR)
});


// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="zh-CN">
          {/* 2. Remove the AuthProvider wrapper */}
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
