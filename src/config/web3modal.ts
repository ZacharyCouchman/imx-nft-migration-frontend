import { defaultConfig } from "@web3modal/ethers5/react"

// 1. Get projectId
export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECTID!;

// 2. Set chains
export const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

export const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo'
}

export const polygon = {
  chainId: 137,
  name: 'Polygon Mainnet',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com/',
  rpcUrl: 'https://polygon-rpc.com'
}

export const imtblzkEvmTestnet = {
  chainId: 13473,
  name: 'Immutable zkEVM Testnet',
  currency: 'tIMX',
  explorerUrl: 'https://explorer.testnet.immutable.com',
  rpcUrl: 'https://rpc.testnet.immutable.com'
}

export const imtblzkEvmMainnet = {
  chainId: 13371,
  name: 'Immutable zkEVM Mainnet',
  currency: 'IMX',
  explorerUrl: 'https://explorer.immutable.com',
  rpcUrl: 'https://rpc.immutable.com'
}

// 3. Create a metadata object
export const metadata = {
  name: 'Immutable zkEVM Token Migration',
  description: 'Migrate NFTs to Immutable zkEVM',
  url: import.meta.env.VITE_SANDBOX_PASSPORT_LOGOUT_REDIRECT_URI!, // origin must match your domain & subdomain
  icons: []
}

// 4. Create Ethers config
export const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})