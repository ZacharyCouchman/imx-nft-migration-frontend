
# NFT Token Migration

This project provides the functionality for users to burn tokens on the source chain and have them minted on Immutable zkEVM. It is meant to be used in conjunction with the webhook backend migration repo [here]().

## Disclaimer

The sample code provided is for reference purposes only and is not officially supported by Immutable. It has undergone best effort testing by Immutable to ensure basic functionality. However, it is essential that you thoroughly test this sample code within your own environment to confirm its functionality and reliability before deploying it in a production setting. Immutable disclaims any liability for any issues that arise due to the use of this sample code. By using this sample code, you agree to perform due diligence in testing and verifying its suitability for your applications.

## Prerequisites

- Node v18, npm v10

## Get Started

Checkout the project branch that you want from above.

Install the latest version of the @imtbl/sdk.

```bash
npm install @imtbl/sdk
npm i
```

This project uses the Web3Modal SDK from WalletConnect to provide a large selection of available wallet connections to the application. This requries a project to be set up in [WalletConnect cloud](https://cloud.walletconnect.com/). Setup an account and a project and copy the projectId.

1. Determine the source/origin chain that the existing NFT contract is deployed on. This is the collection of NFTs that will be burnt (transferred to the burn address) as part of the process.
2. Determie the destination chain that your contract collection is depolyed on. This is the collection where the migrated tokens will be minted.
3. Update the `web3modal` configuration to enable wallets to connect to the source and destination chains. 
  - Go to `src/config/web3modal.ts` and add the project Id from the wallet connect cloud project. Then create a chain configuration for each of your source and destination chains for the migration.
  ```ts
  export const projectId = ''

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
  ```
  - In `App.tsx` include the source in destination chains in `createWeb3Modal()` function call in the chains array
  ```ts
    createWeb3Modal({
    chains: [sepolia, imtblzkEvmTestnet],
    // ... other web3modal config
    })
  ```


## Add configuration

Rename .env.example to .env, replace all of the variables with your own project variables from https://hub.immutable.com.

Update all of the site configuration variables accordingly to configure the project to work with your source contract on the origin chain and the destination contract on Immutable zkEVM. These environment variables should match with what you have configured in the backend code.


## Start

`npm run dev`

## Passport login flow

After setting up your passport clientId and redirect variables, make sure that you have a route to handle the redirect. The component at this route should use the passport instance to call `loginCallback()`. See PassportRedirect component and how it is added to the React Router in main.tsx.

## Gotchas

In order to build for production, a package `jsbi` had to be installed to support one of the dependencies. The alias had to be added to the resovle section of the `vite.config.ts` file.

## Deployment in Vercel

A `vercel.json` file has been added to help configure for deployments in Vercel. This is not neccessary if you are not deploying to Vercel. It is re-writing all routes back to the index.html file to make the React Router work correctly.

## Vite details

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## UI Kit: Chakra UI

- [Chakra UI Docs](https://v2.chakra-ui.com/)
- [Github](https://github.com/chakra-ui/chakra-ui)
- [Additional Examples](https://chakra-templates.vercel.app/)