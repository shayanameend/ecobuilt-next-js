const api = {
  auth: {
    signUp: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
    },
    signIn: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
    },
    forgotPassword: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
    },
    resendOtp: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
    },
    verifyOtp: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
    },
    updatePassword: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`,
    },
    refresh: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    },
  },
  public: {
    categories: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    },
    vendors: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/vendors/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
    },
    products: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/products`,
    },
    reviews: {
      url: (productId: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${productId}`,
    },
    contact: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/contact`,
    },
    profile: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/profile`,
    },
  },
  superAdmin: {
    admins: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/admins`,
    },
  },
  admin: {
    profile: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
    },
    dashboard: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
    },
    users: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
    },
    vendors: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/vendors/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/vendors`,
    },
    categories: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
    },
    products: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/products`,
    },
    orders: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
    },
  },
  vendor: {
    profile: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/vendor/profile`,
    },
    dashboard: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/vendor/dashboard`,
    },   
    users: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/vendor/users/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/vendor/users`,
    },
    categories: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/vendor/categories`,
    },
    products: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/vendor/products/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/vendor/products`,
    },
    orders: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/vendor/orders`,
    },
  },
  user: {
    profile: {
      url: () => `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    },
    orders: {
      url: (id?: string) =>
        id
          ? `${process.env.NEXT_PUBLIC_API_URL}/user/orders/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/user/orders`,
    },
    reviews: {
      url: (orderId: string) =>
        `${process.env.NEXT_PUBLIC_API_URL}/user/reviews/${orderId}`,
    },
  },
};

const app = {
  auth: {
    signUp: {
      url: () => "/auth/sign-up",
      label: "Sign Up",
    },
    signIn: {
      url: () => "/auth/sign-in",
      label: "Sign In",
    },
    forgotPassword: {
      url: () => "/auth/forgot-password",
      label: "Forgot Password",
    },
    resendOtp: {
      url: () => "/auth/resend-otp",
      label: "Resend OTP",
    },
    verifyOtp: {
      url: () => "/auth/verify-otp",
      label: "Verify OTP",
    },
    updatePassword: {
      url: () => "/auth/update-password",
      label: "Update Password",
    },
    refresh: {
      url: () => "/auth/refresh",
      label: "Refresh",
    },
  },
  public: {
    home: {
      url: () => "/",
      label: "Home",
    },
    products: {
      url: (id?: string) => (id ? `/products/${id}` : "/products"),
      label: "Marketplace",
    },
    vendors: {
      url: (id?: string) => (id ? `/vendors/${id}` : "/vendors"),
      label: "Vendors",
    },
    community: {
      url: () => "/community",
      label: "Community",
    },
    contact: {
      url: () => "/contact",
      label: "Contact",
    },
  },
  unspecified: {
    profile: {
      url: () => "/profile",
      label: "Profile",
    },
  },
  superAdmin: {
    admins: {
      url: () => "/admin/admins",
      label: "Admins",
    },
  },
  admin: {
    dashboard: {
      url: () => "/admin/dashboard",
      label: "Dashboard",
    },
    categories: {
      url: () => "/admin/categories",
      label: "Categories",
    },
    products: {
      url: () => "/admin/products",
      label: "Products",
    },
    orders: {
      url: () => "/admin/orders",
      label: "Orders",
    },
    vendors: {
      url: () => "/admin/vendors",
      label: "Vendors",
    },
    users: {
      url: () => "/admin/users",
      label: "Users",
    },
    settings: {
      url: () => "/admin/settings",
      label: "Settings",
    },
  },
  vendor: {
    dashboard: {
      url: () => "/vendor/dashboard",
      label: "Dashboard",
    },
    categories: {
      url: () => "/vendor/categories",
      label: "Categories",
    },
    products: {
      url: () => "/vendor/products",
      label: "Products",
    },
    orders: {
      url: () => "/vendor/orders",
      label: "Orders",
    },
    users: {
      url: () => "/vendor/users",
      label: "Customers",
    },
    settings: {
      url: () => "/vendor/settings",
      label: "Settings",
    },
  },
  user: {
    settings: {
      url: () => "/user/settings",
      label: "Settings",
    },
    checkout: {
      url: () => "/user/checkout",
      label: "Checkout",
    },
    orders: {
      url: () => "/user/orders",
      label: "Orders",
    },
  },
};

export const routes = {
  api,
  app,
};

export const authRoutes = [
  routes.app.auth.signUp.url(),
  routes.app.auth.signIn.url(),
  routes.app.auth.forgotPassword.url(),
  routes.app.auth.resendOtp.url(),
  routes.app.auth.verifyOtp.url(),
  routes.app.auth.updatePassword.url(),
  routes.app.auth.refresh.url(),
];

export const publicRoutes = [
  routes.app.public.home.url(),
  routes.app.public.products.url(),
  routes.app.public.vendors.url(),
  routes.app.public.community.url(),
  routes.app.public.contact.url(),
];

export const adminRoutes = [
  routes.app.admin.dashboard.url(),
  routes.app.admin.categories.url(),
  routes.app.admin.products.url(),
  routes.app.admin.orders.url(),
  routes.app.admin.users.url(),
  routes.app.admin.vendors.url(),
  routes.app.superAdmin.admins.url(),
  routes.app.admin.settings.url(),
];

export const vendorRoutes = [
  routes.app.vendor.dashboard.url(),
  routes.app.vendor.categories.url(),
  routes.app.vendor.products.url(),
  routes.app.vendor.orders.url(),
  routes.app.vendor.users.url(),
  routes.app.vendor.settings.url(),
];

export const userRoutes = [
  routes.app.user.settings.url(),
  routes.app.user.checkout.url(),
  routes.app.user.orders.url(),
];
