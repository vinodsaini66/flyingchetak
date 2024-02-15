export declare const getFinalPrice: (itemPrice: number, totalPrice: number, discountAmount: number) => number;
export declare const getAdminAndProviderCut: (finalPrice: any, adminCommission: any) => {
    provider: number;
    admin: number;
};
