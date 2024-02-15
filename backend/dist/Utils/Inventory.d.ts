declare class Inventory {
    constructor();
    getProductInventory(productId: string, variantId: string | null): Promise<{
        sold: number;
        stock: number;
    }>;
    productSold(orderedProductId: any): Promise<boolean>;
}
declare let inventory: Inventory;
export default inventory;
