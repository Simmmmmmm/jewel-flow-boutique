import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  user_id: string;
  type: string;
  is_default: boolean;
  first_name: string;
  last_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
}

const API_BASE_URL = 'http://localhost:4000/api';

const Account: React.FC = () => {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  const [addressForm, setAddressForm] = useState({
    type: 'shipping' as const,
    is_default: false,
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: ''
  });

  useEffect(() => {
    document.title = 'My Account | Artlery';
    
    if (!user) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user?.id || !token) return;

    try {
      setLoading(true);
      
      // Load profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
        setProfileForm({
          first_name: profileData.profile.first_name || '',
          last_name: profileData.profile.last_name || '',
          phone: profileData.profile.phone || ''
        });
      }

      // Load addresses
      const addressesResponse = await fetch(`${API_BASE_URL}/addresses/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (addressesResponse.ok) {
        const addressData = await addressesResponse.json();
        // Keep only first two addresses
        setAddresses((addressData.addresses || []).slice(0, 2));
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) return;

    try {
      setSaving(true);
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: user.id, ...profileForm })
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();

    toast.success('Profile updated successfully');
    setProfile(data.profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !token) return;

    try {
      setSaving(true);
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: user.id, ...addressForm })
    });

    if (!response.ok) {
      throw new Error('Failed to add address');
    }

    const data = await response.json();

    toast.success('Address added successfully');
    setAddressForm({
      type: 'shipping',
      is_default: false,
      first_name: '',
      last_name: '',
      company: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      phone: ''
    });
    setAddresses(prev => [...prev, data.address]);
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-luxury-body">Loading account...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-luxury-heading text-4xl md:text-5xl font-serif font-bold">My Account</h1>
              <p className="text-luxury-body mt-2">Manage your profile and preferences</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <div className="space-y-6">
              {/* Existing addresses */}
              {addresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Addresses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        // Filter addresses to remove duplicates if shipping and billing are same
                        const uniqueAddresses: Address[] = [];
                        addresses.forEach(addr => {
                          const isDuplicate = uniqueAddresses.some(existing => 
                            existing.address_line_1 === addr.address_line_1 &&
                            existing.address_line_2 === addr.address_line_2 &&
                            existing.city === addr.city &&
                            existing.state === addr.state &&
                            existing.postal_code === addr.postal_code &&
                            existing.country === addr.country
                          );
                          if (!isDuplicate) {
                            uniqueAddresses.push(addr);
                          }
                        });
                        return uniqueAddresses.map(address => (
                          <div key={address.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{address.type} Address</span>
                              {address.is_default && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.first_name} {address.last_name}
                              {address.company && <><br />{address.company}</>}
                              <br />
                              {address.address_line_1}
                              {address.address_line_2 && <><br />{address.address_line_2}</>}
                              <br />
                              {address.city}, {address.state} {address.postal_code}
                              <br />
                              {address.country}
                              {address.phone && <><br />Phone: {address.phone}</>}
                            </p>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add new address */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Address</CardTitle>
                  <CardDescription>
                    Add a new shipping or billing address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addr_first_name">First Name</Label>
                        <Input
                          id="addr_first_name"
                          value={addressForm.first_name}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, first_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="addr_last_name">Last Name</Label>
                        <Input
                          id="addr_last_name"
                          value={addressForm.last_name}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, last_name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={addressForm.company}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line_1">Address Line 1</Label>
                      <Input
                        id="address_line_1"
                        value={addressForm.address_line_1}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, address_line_1: e.target.value }))}
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address_line_2"
                        value={addressForm.address_line_2}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, address_line_2: e.target.value }))}
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input
                          id="postal_code"
                          value={addressForm.postal_code}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, postal_code: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addr_phone">Phone (Optional)</Label>
                      <Input
                        id="addr_phone"
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? 'Adding...' : 'Add Address'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your past orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.id && token ? (
                  <UserOrders userId={user.id} token={token} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      {loading ? 'Loading orders...' : 'Unable to load orders. Please try again.'}
                    </p>
                    {!loading && (
                      <Button onClick={() => navigate('/orders')}>
                        View All Orders
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface Order {
  id?: string;
  orderId?: string;
  items?: Array<{
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
  }>;
  shipping_info?: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    state?: string;
  };
  subtotal?: number;
  delivery_charge?: number;
  total?: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  order_date?: string;
  created_at?: string;
  date?: string;
  updated_at?: string;
}

const UserOrders: React.FC<{ userId: string | undefined; token: string }> = ({ userId, token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders for userId:', userId);
        const response = await fetch(`http://localhost:4000/api/user/orders/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Orders response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Orders data received:', data);
          setOrders(data.orders || []);
        } else {
          console.error('Failed to fetch orders:', response.status, response.statusText);
          const errorData = await response.text();
          console.error('Error response:', errorData);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      console.log('No userId provided, skipping order fetch');
      setLoading(false);
    }
  }, [userId, token]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date not available';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {orders.map((order, index) => {
          // Safety check for order object
          if (!order || typeof order !== 'object') {
            console.error('Invalid order object:', order);
            return null;
          }

          const orderId = order.id || order.orderId || `order-${index}`;
          const orderDate = order.order_date || order.created_at || order.date;
          const orderTotal = typeof order.total === 'number' ? order.total : 0;
          const orderStatus = order.status || 'pending';
          const orderItems = Array.isArray(order.items) ? order.items : [];

          return (
            <div key={orderId} className="border rounded-lg p-4 shadow-elegant">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Order #{orderId}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(orderDate)}</p>
                </div>
                <div>
                  <p className="font-semibold">{formatPrice(orderTotal)}</p>
                  <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(orderStatus)}`}>
                    {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4 overflow-x-auto">
                  {orderItems.slice(0, 3).map((item, itemIndex) => {
                    if (!item || typeof item !== 'object') return null;

                    const itemId = item.id || `item-${itemIndex}`;
                    const itemName = item.name || 'Product';
                    const itemImage = item.image || '';

                    return (
                      <img
                        key={itemId}
                        src={itemImage}
                        alt={itemName}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          // Hide broken images
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    );
                  })}
                  {orderItems.length > 3 && (
                    <div className="w-16 h-16 flex items-center justify-center bg-gold-100 rounded-lg text-gold-600 font-semibold">
                      +{orderItems.length - 3}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedOrder(order);
                    setDetailsOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Order #{selectedOrder.id || selectedOrder.orderId}</h3>
                <p>Date: {formatDate(selectedOrder.order_date || selectedOrder.created_at || selectedOrder.date)}</p>
                <p>Status: {selectedOrder.status}</p>
                <p>Total: {formatPrice(selectedOrder.total || 0)}</p>
              </div>
              <div>
                <h4 className="font-semibold">Items:</h4>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <li key={item.id || idx}>
                        {item.name} - {item.quantity} x {formatPrice(item.price || 0)}
                      </li>
                    ))
                  ) : (
                    <li>No items found</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Shipping Info:</h4>
                {selectedOrder.shipping_info ? (
                  <div>
                    <p>{selectedOrder.shipping_info.full_name}</p>
                    <p>{selectedOrder.shipping_info.address}</p>
                    <p>
                      {selectedOrder.shipping_info.city}, {selectedOrder.shipping_info.state}{' '}
                      {selectedOrder.shipping_info.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_info.phone}</p>
                    <p>{selectedOrder.shipping_info.email}</p>
                  </div>
                ) : (
                  <p>No shipping info available</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold">Payment Info:</h4>
                <p>Method: {selectedOrder.payment_method || 'N/A'}</p>
                <p>Status: {selectedOrder.payment_status || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold">Order Summary:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>{formatPrice(selectedOrder.delivery_charge || 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.total || 0)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <p>No order selected</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Account;
