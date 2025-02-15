export interface listNFTsByAccountAddressResult {
  page: Page;
  result: Nft[];
}

export interface Page {
  next_cursor: null;
  previous_cursor: null;
}

export interface Nft {
  animation_url: null;
  attributes: null;
  balance: string;
  chain: Chain;
  contract_address: string;
  contract_type: string;
  description: null;
  external_link: null;
  image: null;
  indexed_at: Date;
  metadata_id: string;
  metadata_synced_at: Date;
  name: null;
  token_id: string;
  updated_at: Date;
  youtube_url: null;
}

export interface Chain {
  id: string;
  name: string;
}

export interface Collection {
  base_uri: string;
  chain: Chain;
  contract_address: string;
  contract_type: string;
  contract_uri: string;
  description: string;
  external_link: string;
  image: string;
  indexed_at: Date;
  metadata_synced_at: Date;
  name: string;
  symbol: string;
  updated_at: Date;
  verification_status: string;
}
