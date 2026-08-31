export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  address: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "customer" | "admin";
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface StoreInfo {
  name: string;
  phone: string;
  whatsapp: string;
  mapUrl: string;
  email: string;
  address: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  image: string;
}
