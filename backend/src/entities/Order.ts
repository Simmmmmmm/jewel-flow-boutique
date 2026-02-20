export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  shipping_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    state: string;
  };
  subtotal: number;
  delivery_charge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  order_date: Date;
  updated_at: Date;
}
