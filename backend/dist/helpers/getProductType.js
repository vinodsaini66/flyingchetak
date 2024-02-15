"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductType = void 0;
const getProductType = (product) => {
    if (product === null || product === void 0 ? void 0 : product.product_id) {
        return "variant";
    }
    else {
        return "product";
    }
};
exports.getProductType = getProductType;
