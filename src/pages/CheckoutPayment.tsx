import React, { useState, useEffect } from 'react';

interface PaymentProps {
  totalAmount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailure: (error: any) => void;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingInfo: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

const CheckoutPayment = ({ totalAmount, onPaymentSuccess, onPaymentFailure, cartItems, shippingInfo }: PaymentProps) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error('Razorpay SDK failed to load');
    document.body.appendChild(script);
  }, []);

  const openRazorpayCheckout = () => {
    if (!razorpayLoaded) {
      alert('Payment SDK is not loaded yet. Please try again.');
      return;
    }

    fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        shipping_info: {
          full_name: `${shippingInfo.first_name} ${shippingInfo.last_name}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address_line_1: shippingInfo.address_line_1,
          address_line_2: shippingInfo.address_line_2 || '',
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.postal_code,
          country: shippingInfo.country
        },
        subtotal: totalAmount,
        delivery_charge: 0,
        total: totalAmount,
        payment_method: 'Online Payment',
        payment_details: {}
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          onPaymentFailure('Failed to create order');
          return;
        }

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || '', // Replace with your key
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: 'Jewel Flow Boutique',
          description: 'Order Payment',
          order_id: data.razorpayOrder.id,
          handler: function (response: any) {
            // Verify payment on backend
            fetch('http://localhost:4000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            })
              .then(res => res.json())
              .then(verifyRes => {
                if (verifyRes.success) {
                  onPaymentSuccess(response);
                } else {
                  onPaymentFailure('Payment verification failed');
                }
              })
              .catch(err => onPaymentFailure(err));
          },
          prefill: {
            name: `${shippingInfo.first_name} ${shippingInfo.last_name}`,
            email: shippingInfo.email,
            contact: shippingInfo.phone
          },
          theme: {
            color: '#F37254'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      })
      .catch(err => onPaymentFailure(err));
  };

  return (
    <div>
      <button
        onClick={openRazorpayCheckout}
        className="btn-luxury px-6 py-3"
      >
        Pay Now
      </button>
    </div>
  );
};

export default CheckoutPayment;
