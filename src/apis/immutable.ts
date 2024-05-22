import { Environment } from "@imtbl/sdk/config";
import { applicationEnvironment } from "../config/config";
import { zkEVMDataClient } from "../immutable/blockchainData";

export async function getZkEvmNFTsForAddress(address: string, tokenAddress: string) {
  try {
    const result = await zkEVMDataClient.listNFTsByAccountAddress({
      chainName: applicationEnvironment === Environment.PRODUCTION ? 'imtbl-zkevm-mainnet' : 'imtbl-zkevm-testnet',
      accountAddress: address,
      contractAddress: tokenAddress
    });
    console.log(result);
    return result.result;
  } catch (err) {
    console.error(err);
  }
}