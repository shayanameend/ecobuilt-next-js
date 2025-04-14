export enum Role {
  UNSPECIFIED = "UNSPECIFIED",
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  USER = "USER",
}

export enum UserStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum OtpType {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

export enum CategoryStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  APPROVED = "APPROVED",
  PROCESSING = "PROCESSING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
}

export type PublicAuthType = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthType = PublicAuthType & {
  status: UserStatus;
  role: Role;
  isVerified: boolean;
  isDeleted: boolean;
};

export type AdminProfileType = {
  id: string;
  pictureId: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorProfileType = {
  id: string;
  pictureId: string;
  name: string;
  description: string;
  phone: string;
  postalCode: string;
  city: string;
  pickupAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfileType = {
  id: string;
  pictureId: string;
  name: string;
  phone: string;
  postalCode: string;
  city: string;
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicCategoryType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryType = PublicCategoryType & {
  status: CategoryStatus;
  isDeleted: boolean;
};

export type PublicProductType = {
  id: string;
  pictureIds: string[];
  name: string;
  description: string;
  sku: string;
  stock: number;
  price: number;
  salePrice?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductType = PublicProductType & {
  isDeleted: boolean;
};

export type CartItemType = PublicProductType & {
  quantity: number;
};

export type PublicOrderType = {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicOrderToProductType = {
  id: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicReviewType = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminDashboardKPIsType = {
vendorsCount: number;
productsCount: number;
ordersCount: number;
usersCount: number;
recentOrders: PublicOrderType[];
orderToProduct: (PublicOrderToProductType & {
  product: ProductType & {
    category: CategoryType;
    vendor: VendorProfileType;
  };
})[];
user: UserProfileType;
recentProducts: (ProductType & {
  category: CategoryType;
  vendor: VendorProfileType;
})[];
};

export type SingleResponseType<T> = {
  data: T;
  info: {
    message: string;
  };
};

export type MultipleResponseType<T> = {
  data: T;
  meta: {
    total: number;
    pages: number;
    limit: number;
    page: number;
  };
  info: {
    message: string;
  };
};

export type ErrorResponseType<T> = {
  info: {
    message: string;
  };
};
