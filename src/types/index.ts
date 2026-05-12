export interface Product {
  id: string;
  baseCode: string;
  name: string;
  dealer?: string | null;
  colour?: string | null;
  category?: string | null;
  mrp: number;
  cost?: number | null;
  active: boolean;
  notes?: string | null;
}

export interface Sku {
  id: string;
  code: string;
  size: string;
  productId: string;
  product: Product;
  currentStock: number;
  reservedStock: number;
}

export interface OrderData {
  customerName: string;
  phoneNumber: string;
  designCode: string;
  size: string;
  fullAddress: string;
  pincode: string;
  city: string;
  state: string;
  senderName?: string;
  senderPhone?: string;
  flags?: string;
}
