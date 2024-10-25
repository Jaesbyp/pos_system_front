export interface ICustomerResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  businessName: string;
  identification: string;
  address: string;
  identificationType: string;
}

export interface ICustomerUpdate {
  name: string;
  lastName: string;
  email: string;
  businessName: string;
  identification: string;
  address: string;
  identificationType?: string | null;
}
