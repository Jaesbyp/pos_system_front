export interface IStoreResponse {
  id: number;
  storeName: string;
  tradeName: string;
  ruc: string;
  address: string;
  especialTaxpayer: boolean;
  forcedAccounting: boolean;
  electronicSignatureKey: string;
}

export interface IStoreUpdate {
  storeName: string;
  tradeName: string;
  ruc: string;
  address: string;
}
