import { ProductService } from "../baseServices/ProductService";
import { OrderService } from "../baseServices/orderService";
import ProductVariant from "../models/ProductVariant";
import SelectedProduct from "../models/SelectedProduct";

class Inventory {
  constructor() {}

  async getProductInventory(
    productId: string,
    variantId: string | null,
  ): Promise<{ sold: number; stock: number }> {
    console.log(productId, variantId, "------------------------ids");
    const product = await ProductService.getOne(productId);
    console.log(product, "-------------------product");

    let productMatchQuery: {};

    const allProductVariants = await ProductVariant.find({
      product_id: productId,
    });

    if (allProductVariants && allProductVariants.length > 0 && !!variantId) {
      const variant = await ProductService.getVariantById(variantId);
      productMatchQuery = {
        product_id: product._id,
        variant_id: variant._id,
      };
    } else {
      productMatchQuery = {
        product_id: product._id,
      };
    }

    const inventory = await SelectedProduct.find({
      ...productMatchQuery,
    }).populate({
      path: "user_id",
      select: "is_verify is_otp_verify",
      match: {
        is_verify: true,
        is_otp_verify: true,
      },
    });

    const total = inventory.reduce((total: number, item) => {
      return total + item.quantity;
    }, 0);

    const sold = await inventory.reduce(async (total: number, item) => {
      return total + item.sold;
    }, 0);

    const stock = total - sold;

    return { sold, stock };
  }

  async productSold(orderedProductId): Promise<boolean> {
    try {
      const orderedProduct = await OrderService.getOrderedProduct(
        orderedProductId,
      );

      // console.log(orderedProduct, "-------------------------1");

      if (!orderedProduct) {
        // console.log("not otdered produt hfdjshkj");
        return false;
      }

      const productId = orderedProduct.product_id;
      const variantId = orderedProduct.variant_id;

      const selectedProduct = await SelectedProduct.findOne({
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
      await selectedProduct.save();

      return true;
    } catch (e) {
      // console.log(e);
      return false;
    }
  }
}

let inventory = new Inventory();
export default inventory;
