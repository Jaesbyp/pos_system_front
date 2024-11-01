import { IPucharseDetailCreate } from "./IPucharseDetail";

export interface IPucharseResponse {
  id: number;
  invoiceNumber: string;
  orderDate: Date;
  deliveredDate: Date;
  total: number;
  status: PucharseStatusEnum;
  providerId: number;
  providerName: string;
  storeId: number;
}

export enum PucharseStatusEnum {
  CANCELED = "CANCELED",
  PAYED = "PAYED",
  PENDING = "PENDING",
}

export const getPucharseStatusLabel = (status: PucharseStatusEnum): string => {
  switch (status) {
    case PucharseStatusEnum.PAYED:
      return "Pagado";
    case PucharseStatusEnum.PENDING:
      return "Pendiente";
    case PucharseStatusEnum.CANCELED:
      return "Cancelado";
    default:
      return "Desconocido";
  }
};

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
  invoiceNumber?: string;
  orderDate?: Date;
  deliveredDate?: Date;
  status?: PucharseStatusEnum;
  providerId?: number;
}
