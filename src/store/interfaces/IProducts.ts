export interface IProductResponse {
  id: number;
  name: string;
  mainCode: string;
  auxCode: string;
  description: string;
  category: string;
  stock: number;
  unitPrice: number;
  ivaVariable: string;
  imageUrl: string;
  ivaType: string;
  iceType: string;
  irbpType: string;
}

export interface IProductCreate {
  name: string;
  mainCode: string;
  auxCode: string | null;
  description: string;
  stock: number;
  unitPrice: number;
  ivaVariable: string | null;
  category: string;
  ivaType: string;
  iceType: string;
  irbpType: string;
}

export interface IProductUpdate {
  name?: string;
  mainCode?: string;
  auxCode?: string;
  description?: string;
  stock?: number;
  unitPrice?: number;
  ivaVariable?: string;
  category?: string;
  ivaType?: string;
  iceType?: string;
  irbpType?: string;
}
