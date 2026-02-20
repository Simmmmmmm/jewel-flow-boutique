import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
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
  order_date: string;
  updated_at: string;
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleViewOrderDetails = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to view order details.');
        return;
      }
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const order = await response.json();
      // Save order details to localStorage for Invoice page
      localStorage.setItem('current-order', JSON.stringify({
        id: order.id,
        items: order.items,
        shippingInfo: {
          fullName: order.shipping_info.full_name,
          email: order.shipping_info.email,
          phone: order.shipping_info.phone,
          address: order.shipping_info.address,
          city: order.shipping_info.city,
          postalCode: order.shipping_info.postal_code,
          state: order.shipping_info.state
        },
        subtotal: order.subtotal,
        deliveryCharge: order.delivery_charge,
        total: order.total,
        orderDate: order.order_date,
        paymentMethod: order.payment_method
      }));
      navigate('/invoice');
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details.');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/user/orders/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your orders</h2>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading your orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/account">
              <Button variant="ghost" className="hover:text-gold-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Account
              </Button>
            </Link>
            <h1 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold">
              My Orders
            </h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="shadow-elegant">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gold-200 mx-auto mb-4" />
              <h3 className="text-luxury-heading text-xl font-semibold mb-2">
                No orders yet
              </h3>
              <p className="text-luxury-body mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link to="/shop">
                <Button className="btn-luxury">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.order_date)}
                      </p>
                      <p className="font-semibold text-lg">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gold-100 rounded-lg flex items-center justify-center">
                          <span className="text-gold-600 font-semibold">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-luxury-heading">Items</p>
                        <p className="text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-luxury-heading">Payment</p>
                        <p className="text-muted-foreground">{order.payment_method}</p>
                      </div>
                      <div>
                        <p className="font-medium text-luxury-heading">Shipping</p>
                        <p className="text-muted-foreground">
                          {order.shipping_info.city}, {order.shipping_info.state}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="hover:bg-gold-50"
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
