import { InvoiceId } from "aws-sdk/clients/route53domains";
import { IProductResponse } from "./IProducts";

export interface ISellingProductsResponse {
  id: number;
  invoiceId: number;
  productMainCode: string;
  productName: string;
  ivaApplied: string;
  discount: number;
  subtotal: number;
  taxValue: number;
  quantity: number;
}

export interface ISellingProductsEntrance {
  discount: number;
  quantity: number;
  mainCode: string;
  invoiceId: number;
}

export interface ISellingProductsPDF {
  id: number;
  invoiceId: number;
  product: IProductResponse;
  discount: number;
  subtotal: number;
  iva: number;
  ivaValue: number;
  ice: number;
  iceValue: number;
  irbp: number;
  irbpValue: number;
  quantity: number;
}
