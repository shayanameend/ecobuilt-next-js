import {
  type AdminProfileType,
  type AuthType,
  CategoryStatus,
  type CategoryType,
  type ProductType,
  type PublicAuthType,
  type PublicCategoryType,
  type PublicProductType,
  type PublicReviewType,
  Role,
  type UserProfileType,
  UserStatus,
  type VendorProfileType,
} from "~/lib/types";

// Generate random date within the past 2 years
const randomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 2);
  return new Date(
    start.getTime() + Math.random() * (Date.now() - start.getTime()),
  );
};

export const publicAuthData: PublicAuthType[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: `auth_${i + 1}`,
    email: `user${i + 1}@example.com`,
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const authData: AuthType[] = publicAuthData.map((auth, i) => ({
  ...auth,
  status:
    i % 3 === 0
      ? UserStatus.PENDING
      : i % 3 === 1
        ? UserStatus.APPROVED
        : UserStatus.REJECTED,
  role:
    i === 0
      ? Role.SUPER_ADMIN
      : i < 3
        ? Role.ADMIN
        : i < 8
          ? Role.VENDOR
          : Role.USER,
  isVerified: i % 4 !== 0,
  isDeleted: i % 10 === 0,
}));

export const adminProfileData: AdminProfileType[] = Array.from(
  { length: 3 },
  (_, i) => ({
    id: `admin_${i + 1}`,
    pictureId: `admin_pic_${i + 1}`,
    name: `Admin ${i + 1}`,
    phone: `+1-555-${100 + i}-${1000 + i}`,
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const vendorProfileData: VendorProfileType[] = Array.from(
  { length: 5 },
  (_, i) => ({
    id: `vendor_${i + 1}`,
    pictureId: `vendor_pic_${i + 1}`,
    name: `Vendor Company ${i + 1}`,
    description: `A sustainable vendor offering eco-friendly products - ${i + 1}`,
    phone: `+1-555-${200 + i}-${2000 + i}`,
    postalCode: `V${i + 1}K ${i + 1}L${i + 1}`,
    city: ["Vancouver", "Toronto", "Montreal", "Calgary", "Ottawa"][i % 5],
    pickupAddress: `${100 + i} Green Street, Unit ${i + 1}`,
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const userProfileData: UserProfileType[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `user_${i + 1}`,
    pictureId: `user_pic_${i + 1}`,
    name: `User ${i + 1}`,
    phone: `+1-555-${300 + i}-${3000 + i}`,
    postalCode: `U${i + 1}J ${i + 1}M${i + 1}`,
    city: ["Vancouver", "Toronto", "Montreal", "Calgary", "Edmonton"][i % 5],
    deliveryAddress: `${200 + i} Eco Avenue, Apt ${i + 1}`,
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const publicCategoryData: PublicCategoryType[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `category_${i + 1}`,
    name: [
      "Bamboo Products",
      "Recycled Materials",
      "Zero Waste",
      "Organic",
      "Energy Efficient",
      "Biodegradable",
      "Sustainable Fashion",
      "Water Conservation",
      "Renewable Energy",
      "Eco-Friendly Home",
      "Natural Cosmetics",
      "Sustainable Packaging",
    ][i],
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const categoryData: CategoryType[] = publicCategoryData.map(
  (category, i) => ({
    ...category,
    status:
      i % 3 === 0
        ? CategoryStatus.PENDING
        : i % 3 === 1
          ? CategoryStatus.APPROVED
          : CategoryStatus.REJECTED,
    isDeleted: i % 10 === 0,
  }),
);

export const publicProductData: PublicProductType[] = Array.from(
  { length: 20 },
  (_, i) => ({
    id: `product_${i + 1}`,
    pictureIds: Array.from(
      { length: (i % 3) + 1 },
      (_, j) => `product_${i + 1}_pic_${j + 1}`,
    ),
    name: [
      "Bamboo Toothbrush",
      "Recycled Paper Notebook",
      "Beeswax Wraps",
      "Hemp Tote Bag",
      "Solar Powered Charger",
      "Compostable Phone Case",
      "Organic Cotton T-shirt",
      "Reusable Water Bottle",
      "LED Light Bulbs",
      "Bamboo Cutlery Set",
      "Natural Loofah Sponge",
      "Recycled Plastic Planter",
      "Biodegradable Trash Bags",
      "Organic Wool Blanket",
      "Recycled Glass Vase",
      "Sustainable Wood Chair",
      "Eco-friendly Laundry Detergent",
      "Solar Garden Lights",
      "Natural Fiber Dish Brush",
      "Reusable Produce Bags",
    ][i],
    description: `Eco-friendly sustainable product made from environmentally conscious materials - ${i + 1}`,
    sku: `ECO-${1000 + i}`,
    stock: Math.floor(Math.random() * 100) + 10,
    price: Number.parseFloat((Math.random() * 100 + 5).toFixed(2)),
    salePrice:
      i % 3 === 0 ? Number.parseFloat((Math.random() * 80 + 5).toFixed(2)) : 0,
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);

export const productData: ProductType[] = publicProductData.map(
  (product, i) => ({
    ...product,
    isDeleted: i % 15 === 0,
  }),
);

export const publicReviewData: PublicReviewType[] = Array.from(
  { length: 18 },
  (_, i) => ({
    id: `review_${i + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: [
      "Great product, highly recommend!",
      "Exactly what I was looking for.",
      "Good quality but shipping took longer than expected.",
      "Love how eco-friendly this is!",
      "Could be better, but satisfied overall.",
      "Will definitely purchase again.",
    ][i % 6],
    createdAt: randomDate(),
    updatedAt: randomDate(),
  }),
);
