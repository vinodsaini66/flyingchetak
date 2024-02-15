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
const ProductService_1 = require("../baseServices/ProductService");
const orderService_1 = require("../baseServices/orderService");
const ProductVariant_1 = require("../models/ProductVariant");
const SelectedProduct_1 = require("../models/SelectedProduct");
class Inventory {
    constructor() { }
    getProductInventory(productId, variantId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(productId, variantId, "------------------------ids");
            const product = yield ProductService_1.ProductService.getOne(productId);
            console.log(product, "-------------------product");
            let productMatchQuery;
            const allProductVariants = yield ProductVariant_1.default.find({
                product_id: productId,
            });
            if (allProductVariants && allProductVariants.length > 0 && !!variantId) {
                const variant = yield ProductService_1.ProductService.getVariantById(variantId);
                productMatchQuery = {
                    product_id: product._id,
                    variant_id: variant._id,
                };
            }
            else {
                productMatchQuery = {
                    product_id: product._id,
                };
            }
            const inventory = yield SelectedProduct_1.default.find(Object.assign({}, productMatchQuery)).populate({
                path: "user_id",
                select: "is_verify is_otp_verify",
                match: {
                    is_verify: true,
                    is_otp_verify: true,
                },
            });
            const total = inventory.reduce((total, item) => {
                return total + item.quantity;
            }, 0);
            const sold = yield inventory.reduce((total, item) => __awaiter(this, void 0, void 0, function* () {
                return total + item.sold;
            }), 0);
            const stock = total - sold;
            return { sold, stock };
        });
    }
    productSold(orderedProductId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderedProduct = yield orderService_1.OrderService.getOrderedProduct(orderedProductId);
                // console.log(orderedProduct, "-------------------------1");
                if (!orderedProduct) {
                    // console.log("not otdered produt hfdjshkj");
                    return false;
                }
                const productId = orderedProduct.product_id;
                const variantId = orderedProduct.variant_id;
                const selectedProduct = yield SelectedProduct_1.default.findOne({
                    product_id: productId,
                    variant_id: variantId,
                    user_id: orderedProduct.service_provider_id,
                });
                // console.log(selectedProduct, "----------------selected product 78");
                if (!selectedProduct) {
                    return false;
                }
                // console.log(
                //   selectedProduct,
                //   "--------------------------------selected product ------------ 84",
                // );
                selectedProduct.sold = +orderedProduct.quantity;
                yield selectedProduct.save();
                return true;
            }
            catch (e) {
                // console.log(e);
                return false;
            }
        });
    }
}
let inventory = new Inventory();
exports.default = inventory;
