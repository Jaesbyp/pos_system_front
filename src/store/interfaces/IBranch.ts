export interface IBranchResponse {
  id: number;
  key: string;
  name: string;
  address: string;
}

export interface IBranchUpdate {
  name?: string;
  address?: string;
}

export interface IBranchCreate {
  name: string;
  address: string;
}
