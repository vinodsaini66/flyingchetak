declare class GoogleMapHelper {
    constructor();
    calculateTravelTime(source: any, destination: any, travelMode?: any): Promise<false | {
        duration: {
            text: any;
            in_hours: number;
            in_sec: any;
        };
        distance: {
            text: any;
            in_meters: any;
            in_km: number;
            in_mile: number;
        };
    }>;
    getAddressDetails(lat: any, long: any): Promise<false | {
        country: any;
        postalCode: any;
    }>;
}
declare const _default: GoogleMapHelper;
export default _default;
