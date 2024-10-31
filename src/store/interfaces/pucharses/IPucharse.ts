import { IPucharseDetailCreate } from "./IPucharseDetail";

export interface IPucharse {
  id: number;
  invoiceNumber: string;
  orderDate: Date;
  deliveredDate: Date;
  total: number;
  status: PucharseStatusEnum;
  providerId: number;
  storeId: number;
}

export enum PucharseStatusEnum {
  CANCELED = "CANCELED",
  PAYED = "PAYED",
  PENDING = "PENDING",
}

export interface IPucharseCreate {
  invoiceNumber: string;
  orderDate: Date;
  total: number;
  status: PucharseStatusEnum;
  providerId: number;
  storeId: number;
  pucharseDetails: IPucharseDetailCreate[];
}

export interface IPucharseUpdate {
  invoiceNumber: string;
  orderDate: Date;
  deliveredDate: Date;
  status: PucharseStatusEnum;
  providerId: number;
}
