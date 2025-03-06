export interface IProduct {
    id: number;
    code: string;
    name: string;
    price: number;
    old_price: number;
    image_thumb: string | null;
    isOffer: boolean;
}

export interface IProductDetail {
    id: number;
    code: string;
    name: string;
    price: number;
    old_price: number;
    image_thumb: string | null;
    isOffer: boolean;
}
