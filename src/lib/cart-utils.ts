import type {
  CartItemType,
  PublicProductType,
  VendorProfileType,
} from "~/lib/types";

/**
 * Checks if a product being added to the cart is from the same vendor as existing products
 * @param cartItems Current items in the cart
 * @param newProduct Product being added to the cart
 * @returns Object containing vendor compatibility information
 */
export function checkVendorCompatibility(
  cartItems: CartItemType[],
  newProduct: PublicProductType & { vendor: VendorProfileType },
) {
  // If cart is empty, any product can be added
  if (cartItems.length === 0) {
    return {
      isSameVendor: true,
      currentVendor: null,
      newVendor: newProduct.vendor,
    };
  }

  // Find the first item with vendor information to determine current vendor
  const firstItemWithVendor = cartItems.find(
    (item) => (item as any).vendor?.id,
  );

  // If no items have vendor info, assume compatibility
  if (!firstItemWithVendor || !(firstItemWithVendor as any).vendor) {
    return {
      isSameVendor: true,
      currentVendor: null,
      newVendor: newProduct.vendor,
    };
  }

  const currentVendor = (firstItemWithVendor as any).vendor;
  const isSameVendor = currentVendor.id === newProduct.vendor.id;

  return {
    isSameVendor,
    currentVendor,
    newVendor: newProduct.vendor,
  };
}
