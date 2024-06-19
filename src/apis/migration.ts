import config, { applicationEnvironment } from "../config/config";

import { passportInstance } from "../immutable/passport";

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

export async function getAddressMapping(originWallet: string) {
  const idToken = await passportInstance.getIdToken();
  try {
    const response = await fetch(`${baseUrl}/address-mapping/${originWallet.toLowerCase()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status < 200 || response.status > 299) {
      throw new Error(`Unable to fetch address mapping. Returned with ${response.status}.`)
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function createAddressMapping(originWallet: string, signature: string) {
  const idToken = await passportInstance.getIdToken();
  try {
    const response = await fetch(`${baseUrl}/address-mapping`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        originWalletAddress: originWallet,
        signature: signature
      })
    })

    const result = await response.json();

    if (response.status === 401) {
      alert(result.error.toString())
    }

    return result;
  } catch (err) {
    console.log(err)
  }
}