import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalPayment = ({ amount, bookingId, onSuccess, onError, onCancel }) => {
  const [error, setError] = useState(null);

  const initialOptions = {
    "client-id": "test", // Sandbox client ID
    currency: "USD",
    intent: "capture",
  };

  const API = 'https://yatraa-87bo.onrender.com';

  const createOrder = async (data, actions) => {
    if (bookingId) {
      try {
        const token = localStorage.getItem('yathraa_token');
            
        const response = await fetch(`${API}/api/v1/payments/paypal/create/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ booking_id: bookingId }),
        });
        const orderData = await response.json();
        
        if (orderData.orderID) {
            return orderData.orderID;
        } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail? `${errorDetail.issue} ${errorDetail.description}` : JSON.stringify(orderData);
            throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        setError("Could not initiate PayPal Checkout.");
        if (onError) onError();
      }
    } else {
      // Mock flow if no real booking in backend yet
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: amount.toString(),
            },
          },
        ],
      });
    }
  };

  const onApprove = async (data, actions) => {
    if (bookingId) {
        try {
          const token = localStorage.getItem('yathraa_token');

          const response = await fetch(`${API}/api/v1/payments/paypal/verify/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          
          const orderData = await response.json();
          
          if (orderData.error) {
              throw new Error(orderData.error);
          } else {
              onSuccess(data.orderID);
          }
        } catch (error) {
          console.error(error);
          setError(`Sorry, your transaction could not be processed. ${error.message}`);
          if (onError) onError();
        }
    } else {
        return actions.order.capture().then((details) => {
            onSuccess(details.id);
        });
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="w-full">
        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-lg text-sm border border-red-200">{error}</div>}
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "blue", label: "paypal", height: 48 }}
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={() => {
            if (onCancel) onCancel();
          }}
          onError={(err) => {
            setError('Payment encountered an unexpected error.');
            if (onError) onError();
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
