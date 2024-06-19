import { Environment } from "@imtbl/sdk/x";

export const applicationEnvironment = import.meta.env.VITE_IMMUTABLE_ENVIRONMENT === Environment.PRODUCTION
  ? Environment.PRODUCTION
  : Environment.SANDBOX

const config = {
  [Environment.SANDBOX]: {
    immutablePublishableKey: import.meta.env.VITE_SANDBOX_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: import.meta.env.VITE_SANDBOX_PASSPORT_CLIENT_ID,
    passportRedirectUri: import.meta.env.VITE_SANDBOX_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: import.meta.env.VITE_SANDBOX_PASSPORT_LOGOUT_REDIRECT_URI,
    explorerUrl: "https://explorer.testnet.immutable.com",
    migrationBackendApi: import.meta.env.VITE_MIGRATION_BACKEND_API,
    migration: {
      allowOriginMint: import.meta.env.VITE_ALLOW_ORIGIN_MINT === "true",
      sourceCollectionImage: import.meta.env.VITE_SOURCE_COLLECTION_IMAGE!,
      sourceTokenAddress: import.meta.env.VITE_SOURCE_TOKEN_ADDRESS!,
      sourceChainName: import.meta.env.VITE_SOURCE_CHAIN_NAME!,
      burnAddress: import.meta.env.VITE_BURN_ADDRESS!,
      destinationChainName: import.meta.env.VITE_DESTINATION_CHAIN_NAME!,
      destinationTokenAddress: import.meta.env.VITE_DESTINATION_TOKEN_ADDRESS!,
    }
  },
  [Environment.PRODUCTION]: {
    immutablePublishableKey: import.meta.env.VITE_MAINNET_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: import.meta.env.VITE_MAINNET_PASSPORT_CLIENT_ID,
    passportRedirectUri: import.meta.env.VITE_MAINNET_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: import.meta.env.VITE_MAINNET_PASSPORT_LOGOUT_REDIRECT_URI,
    explorerUrl: "https://explorer.immutable.com",
    migrationBackendApi: import.meta.env.VITE_MIGRATION_BACKEND_API,
    migration: {
      allowOriginMint: import.meta.env.VITE_ALLOW_ORIGIN_MINT === "true",
      sourceCollectionImage: import.meta.env.VITE_SOURCE_COLLECTION_IMAGE!,
      sourceTokenAddress: import.meta.env.VITE_SOURCE_TOKEN_ADDRESS!,
      sourceChainName: import.meta.env.VITE_SOURCE_CHAIN_NAME!,
      burnAddress: import.meta.env.VITE_BURN_ADDRESS!,
      destinationChainName: import.meta.env.VITE_DESTINATION_CHAIN_NAME!,
      destinationTokenAddress: import.meta.env.VITE_DESTINATION_TOKEN_ADDRESS!,
    }
  },
};

export default config;
