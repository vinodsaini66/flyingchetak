declare class ShippingCharges {
    constructor();
    static getFedexToken(): Promise<any>;
    static getShippingCharges(): Promise<any>;
}
export default ShippingCharges;
