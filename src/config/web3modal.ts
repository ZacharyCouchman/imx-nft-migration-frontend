import { defaultConfig } from "@web3modal/ethers5/react"

// 1. Get projectId
export const projectId = 'e5531fbe9d029d502b2c640d567ea40b'

// 2. Set chains
export const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 2. Set chains
export const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo'
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
  url: 'http://localhost:5173', // origin must match your domain & subdomain
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