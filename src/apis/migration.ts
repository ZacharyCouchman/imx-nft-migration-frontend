import config, { applicationEnvironment } from "../config/config";

const baseUrl = config[applicationEnvironment].migrationBackendApi;

export async function getNFTsForAddress(address: string, tokenAddress: string) {
  try {
    const response = await fetch(`${baseUrl}/wallet-nfts/${address}/token/${tokenAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}