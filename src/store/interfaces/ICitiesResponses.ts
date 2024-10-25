export interface IProvinceResponse {
    id: number;
    name: string;
}

export interface ICityResponse {
    id: number;
    name: string;
    provinceName: string;
}
