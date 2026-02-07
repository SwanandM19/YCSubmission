declare module 'razorpay' {
  interface RazorpayConfig {
    key_id: string;
    key_secret: string;
  }

  interface RazorpayOrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
  }

  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, any>;
    created_at: number;
  }

  interface RazorpayOrders {
    create(options: RazorpayOrderOptions): Promise<RazorpayOrder>;
  }

  class Razorpay {
    constructor(config: RazorpayConfig);
    orders: RazorpayOrders;
  }

  export = Razorpay;
}

// Window interface for Razorpay checkout
interface Window {
  Razorpay: any;
}
