
export interface PaymentRequest {
  amount: number; // Amount in paisa
  purchase_order_id: string;
  purchase_order_name: string;
  return_url: string;
  website_url: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentInitiateResponse {
  pidx: string;
  payment_url: string;
}

export interface PaymentLookupResponse {
  transaction_id: string;
  status: 'Completed' | 'Pending' | 'Failed';
  total_amount: number; // Total amount in paisa
  purchase_order_id: string;
  purchase_order_name: string;
  mobile?: string;
}
