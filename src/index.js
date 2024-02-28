import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.less'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { publicProvider } from 'wagmi/providers/public'
import { development,LensProvider } from '@lens-protocol/react-web';
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)
 
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false, // see https://github.com/wagmi-dev/wagmi/issues/2511
      },
    }),
  ],
})
const lensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  // <React.StrictMode>
    <WagmiConfig config={config}>
        {/* <YourRoutes /> */}
        <LensProvider config={lensConfig}>
          <App />
        </LensProvider>
    </WagmiConfig>
    
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
