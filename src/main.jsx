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

const config = getDefaultConfig({
  appName: 'WHO\'S YOUR MASTER',
  projectId: 'a671fe9e58f0db6ec65ba3aaa32e0315', // 请在这里替换为从 WalletConnect Cloud 复制的完整ID
  chains: [mainnet, polygon, optimism, arbitrum, base],
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
