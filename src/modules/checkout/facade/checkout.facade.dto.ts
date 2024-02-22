export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
        productId: string;
        quantity: number;
    }[];
}

export interface PlaceOrderFacadeOutputDto {
    id?: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    }[]
}
