export interface IPucharseDetail {
  id: number;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
  total: number;
  pucharseId: number;
  productId: number;
}

export interface IPucharseDetailCreate {
  productId: number;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
}

export interface IPucharseDetailUpdate {
  productId: number;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
}
