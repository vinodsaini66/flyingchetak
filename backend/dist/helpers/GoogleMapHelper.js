"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const twilio = require("twilio");
class GoogleMapHelper {
    constructor() { }
    // source and destination lat,long
    calculateTravelTime(source, destination, travelMode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mode = !!travelMode ? travelMode : "driving";
                console.log(mode, "mode");
                const apiKey = "AIzaSyAad0w-9p1zROAeni2JakxvkSfX_YDIkF4"; // Travel Mode  => Choose from 'driving', 'walking', 'transit', 'bicycling'
                const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&mode=${mode}&key=${apiKey}`;
                let response = yield axios_1.default.get(apiUrl);
                console.log(response, "response");
                const { rows } = response.data;
                console.log(rows, "rows");
                const { duration: Gduration, distance: Gdistance } = rows[0].elements[0];
                console.log(Gduration, "map", Gdistance);
                const duration = {
                    text: Gduration.text,
                    in_hours: Gduration.value / 3600,
                    in_sec: Gduration.value,
                };
                const distance = {
                    text: Gdistance.text,
                    in_meters: Gdistance.value,
                    in_km: Gdistance.value / 1000,
                    in_mile: Math.round(((Gdistance.value / 1000) / 1.60934) * 100) / 100
                };
                return { duration, distance };
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    getAddressDetails(lat, long) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(lat, long, "hfjdhjhjdgh------------------- latlng");
            try {
                const apiKey = "AIzaSyAad0w-9p1zROAeni2JakxvkSfX_YDIkF4";
                const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},%${long}&key=AIzaSyAad0w-9p1zROAeni2JakxvkSfX_YDIkF4`;
                let response = yield axios_1.default.get(apiUrl);
                console.log(response === null || response === void 0 ? void 0 : response.data, "response?.data");
                const postalCodeObj = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.results[0]) === null || _b === void 0 ? void 0 : _b.address_components.find(component => component.types.includes('postal_code'));
                const postalCode = postalCodeObj ? postalCodeObj.long_name : null;
                const contryObj = (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.results[0]) === null || _d === void 0 ? void 0 : _d.address_components.find(component => component.types.includes('country')); // || component.types.includes('political') || component.types.includes('administrative_area_level_2'));
                const country = contryObj ? contryObj.short_name : null;
                return {
                    country, postalCode
                };
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.default = new GoogleMapHelper();
