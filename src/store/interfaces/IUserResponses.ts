export default interface IUserResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  rol: string;
}

export enum UserRoles {
  ADMIN = "Administrador",
  USER = "Usuario",
}

export interface IUserRegister {
  name: string;
  lastName: string;
  email: string;
  password: string;
  rol: string;
}

export interface IUserUpdate {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
}
