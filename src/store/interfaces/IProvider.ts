export interface IProviderResponse {
  id: number;
  identification: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  identificationTypeCode: string;
  storeId: number;
}

export interface IProviderCreate extends Omit<IProviderResponse, "id"> {}

export interface IProviderUpdate extends Partial<IProviderCreate> {}
