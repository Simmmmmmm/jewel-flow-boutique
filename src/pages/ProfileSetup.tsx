import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profile
      const profileResponse = await fetch('http://localhost:4000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone
        })
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Save address
      const addressResponse = await fetch('http://localhost:4000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'shipping',
          is_default: true,
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: '',
          address_line_1: formData.address,
          address_line_2: '',
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: 'US',
          phone: formData.phone
        })
      });

      if (!addressResponse.ok) {
        throw new Error('Failed to save address');
      }

      toast({
        title: 'Profile completed!',
        description: 'Your profile has been set up successfully.'
      });

      navigate('/');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete profile setup. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="hover:text-gold-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/20 rounded-full mb-4">
              <User className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <CardTitle className="text-2xl font-serif">Complete Your Profile</CardTitle>
            <p className="text-muted-foreground mt-2">
              Please provide your details to enhance your shopping experience
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="State"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">ZIP Code</label>
                    <Input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
