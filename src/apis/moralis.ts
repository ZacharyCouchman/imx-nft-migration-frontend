import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import config, { applicationEnvironment } from "../config/config";

Moralis.start({
  apiKey: config[applicationEnvironment].moralisApiKey,
}).then(() => console.log("Moralis started..."))

export async function getNFTsForAddress(address: string, tokenAddress: string) {
  try {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: EvmChain.SEPOLIA,
      tokenAddresses: [tokenAddress]
    });

    console.log(response.toJSON());
    return response.result;
  } catch (err) {
    console.error(err);
  }
}