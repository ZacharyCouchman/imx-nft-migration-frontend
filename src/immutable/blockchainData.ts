import { blockchainData } from '@imtbl/sdk';
import config, { applicationEnvironment } from '../config/config';

export const zkEVMDataClient = new blockchainData.BlockchainData({
  baseConfig: {
    environment: applicationEnvironment,
    publishableKey: config[applicationEnvironment].immutablePublishableKey,
  },
});