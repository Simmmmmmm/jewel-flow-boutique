import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Plus } from 'lucide-react';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
}

interface SavedAddress {
  id: string;
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
  created_at: string;
}

const CheckoutInfo = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout-info' } });
    }
  }, [user, navigate]);

  // Load user profile and saved addresses
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsLoadingAddresses(true);

        // Fetch user profile
        const profileResponse = await fetch('http://localhost:4000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let profile = null;
        if (profileResponse.ok) {
          profile = await profileResponse.json();
        }

        // Fetch user addresses
        const addressesResponse = await fetch(`http://localhost:4000/api/addresses/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let addressesData: any = null;
        if (addressesResponse.ok) {
          addressesData = await addressesResponse.json();
          console.log('Fetched addresses:', addressesData);
          // The API returns { addresses: [...] }, show only the latest address
          const allAddresses = addressesData.addresses || [];
          const latestAddress = allAddresses.sort((a: SavedAddress, b: SavedAddress) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          setSavedAddresses(latestAddress ? [latestAddress] : []);
        } else {
          console.warn('Failed to fetch addresses:', addressesResponse.status);
          setSavedAddresses([]);
        }

        // Set default selection and pre-populate form
        const addresses = addressesData?.addresses || [];
        const latestAddress = addresses.sort((a: SavedAddress, b: SavedAddress) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        if (latestAddress) {
          setSelectedAddressId(latestAddress.id);
          populateFormWithAddress(latestAddress, profile, user);
        } else {
          // No saved addresses, use profile data
          setSelectedAddressId('new');
          setShippingInfo({
            fullName: profile?.first_name && profile?.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : '',
            email: user.email || '',
            phone: profile?.phone || '',
            address: '',
            city: '',
            postalCode: '',
            state: '',
          });
        }

        setIsLoadingAddresses(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsLoadingAddresses(false);
      }
    };

    loadUserData();
  }, [user]);

  const populateFormWithAddress = (address: SavedAddress, profile: any, user: any) => {
    setShippingInfo({
      fullName: `${address.first_name} ${address.last_name}`,
      email: user.email || '',
      phone: address.phone || profile?.phone || '',
      address: address.address_line_1,
      city: address.city,
      postalCode: address.postal_code,
      state: address.state,
    });
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);

    if (addressId === 'new') {
      // Clear form for new address entry
      setShippingInfo({
        fullName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        state: '',
      });
    } else {
      // Find and populate with selected address
      const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        populateFormWithAddress(selectedAddress, null, user);
      } else {
        // If address not found, clear form
        setShippingInfo({
          fullName: '',
          email: user?.email || '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          state: '',
        });
      }
    }
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated');
        return;
      }

      // If user selected "new" address, save it to backend
      if (selectedAddressId === 'new') {
        const response = await fetch('http://localhost:4000/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: (user as any)?.id || (user as any)?._id || '', // cast user to any to bypass TS error
            type: 'shipping',
            is_default: false,
            first_name: shippingInfo.fullName.split(' ')[0] || '',
            last_name: shippingInfo.fullName.split(' ').slice(1).join(' ') || '',
            company: null,
            address_line_1: shippingInfo.address,
            address_line_2: null,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postal_code: shippingInfo.postalCode,
            country: 'India', // or get from user input if available
            phone: shippingInfo.phone
          })
        });

        if (response.status === 409) {
          // Address already exists, find it in the current list and select it
          const errorData = await response.json();
          const existingAddress = errorData.address;
          const existingAddressInList = savedAddresses.find(addr => addr.id === existingAddress.id);
          if (existingAddressInList) {
            setSelectedAddressId(existingAddressInList.id);
          } else {
            // If not in current list, add it and select it
            setSavedAddresses(prev => [...prev, existingAddress]);
            setSelectedAddressId(existingAddress.id);
          }
        } else if (!response.ok) {
          const errorData = await response.json();
          alert('Failed to save address: ' + (errorData.message || 'Unknown error'));
          return;
        } else {
          const data = await response.json();
          // Update saved addresses state with new address
          setSavedAddresses(prev => [...prev, data.address]);
          setSelectedAddressId(data.address.id);
        }
      }

      // Save shipping info to localStorage for the order summary
      localStorage.setItem('checkout-shipping-info', JSON.stringify(shippingInfo));
      navigate('/order-summary');
    } catch (error) {
      console.error('Error submitting shipping info:', error);
      alert('Error submitting shipping info');
    }
  };

  const isFormValid = Object.values(shippingInfo).every(value => value.trim() !== '');

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:text-cyan-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Shipping Information</CardTitle>
            <p className="text-muted-foreground">Please provide your delivery details</p>
          </CardHeader>
          <CardContent>
            {/* Address Selection */}
            {!isLoadingAddresses && (
              <div className="space-y-6">
                <Label className="text-lg font-semibold">Saved Addresses from My Account</Label>
                <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection}>
                  <div className="space-y-4 border p-4 rounded-md bg-muted">
                    {savedAddresses.length > 0 ? (
                      savedAddresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={address.id} className="cursor-pointer font-medium">
                              {address.first_name} {address.last_name}
                              {address.is_default && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </Label>
                            <div className="text-sm text-muted-foreground mt-1">
                              {address.address_line_1}
                              {address.address_line_2 && <><br />{address.address_line_2}</>}
                              <br />
                              {address.city}, {address.state} {address.postal_code}
                              {address.phone && <><br />Phone: {address.phone}</>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No saved addresses found in your account.</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="new" id="new" />
                    <div className="flex-1">
                      <Label htmlFor="new" className="cursor-pointer font-medium flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Use a new address
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter a different shipping address
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  className="focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                    className="focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormValid}
                >
                  Continue to Order Summary
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutInfo;