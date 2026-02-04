import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAddresses, useCreateAddress, useOrders } from '@/hooks/useEcommerce';
import { useToast } from '@/components/ui/use-toast';
import { User, MapPin, ShoppingBag, Phone, Mail, Edit } from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const { user, userProfile, loading } = useAuth();
  const { toast } = useToast();
  const { data: orders = [] } = useOrders(user?.id || '');
  const { data: addresses = [] } = useAddresses(user?.id || '');
  const createAddress = useCreateAddress();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    type: 'both' as const,
  });

  useEffect(() => {
    // Only redirect if auth is finished loading AND user is not authenticated
    if (!loading && !user) {
      navigate('/auth/signin');
    }
  }, [user, loading, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createAddress.mutateAsync({
        user_id: user.id,
        ...addressForm,
        country: 'India',
        is_default: addresses.length === 0,
        street_address2: '',
      });
      setShowAddressForm(false);
      setAddressForm({
        full_name: userProfile?.full_name || '',
        phone: userProfile?.phone || '',
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        type: 'both',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add address',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-tea-gold/5 to-transparent">
        <Navbar />
        <div className="flex-1 flex items-center justify-center mt-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tea-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order: any) => sum + (order.total_amount || 0), 0);
  const lastOrder = orders[0];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-tea-gold/5 to-transparent">
      <Navbar />

      <div className="flex-1 mt-20">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Welcome, {userProfile?.full_name || 'Customer'}!
            </h1>
            <p className="text-gray-600">Manage your profile, addresses, and orders</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-4xl font-bold text-tea-gold">{totalOrders}</p>
              </div>
              <ShoppingBag className="text-tea-gold opacity-30" size={48} />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Spent</p>
                <p className="text-4xl font-bold text-tea-gold">₹{totalSpent.toFixed(0)}</p>
              </div>
              <ShoppingBag className="text-green-600 opacity-30" size={48} />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Saved Addresses</p>
                <p className="text-4xl font-bold text-tea-gold">{addresses.length}</p>
              </div>
              <MapPin className="text-blue-600 opacity-30" size={48} />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-tea-gold/20 flex items-center justify-center">
                  <User className="text-tea-gold" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userProfile?.full_name || 'User'}</h2>
                  <p className="text-sm text-gray-600">Customer Account</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900 break-all">{userProfile?.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {userProfile?.phone || <span className="text-gray-500">Not set</span>}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(userProfile?.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-tea-gold text-tea-gold hover:bg-tea-gold/5"
                onClick={() => navigate('/account/edit')}
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </Card>

            {/* Last Order Card */}
            {lastOrder && (
              <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-tea-gold/10 to-transparent">
                <h3 className="font-bold text-gray-900 mb-3">Last Order</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono text-sm font-semibold">{lastOrder.id.slice(0, 8)}...</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-sm font-semibold">
                      {new Date(lastOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-lg font-bold text-tea-gold">₹{(lastOrder.total_amount || 0).toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  variant="gold-outline"
                  className="w-full text-xs"
                  onClick={() => navigate(`/order/${lastOrder.id}`)}
                >
                  View Details
                </Button>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Addresses Section */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="text-tea-gold" size={28} />
                    Saved Addresses
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses</p>
                </div>
                <Button
                  size="sm"
                  className="bg-tea-gold hover:bg-tea-gold/90"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  {showAddressForm ? 'Cancel' : '+ Add Address'}
                </Button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 border border-tea-gold/20 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={addressForm.full_name}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, full_name: e.target.value })
                      }
                      required
                    />
                    <Input
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Input
                    placeholder="Street Address"
                    value={addressForm.street_address}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, street_address: e.target.value })
                    }
                    required
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      required
                    />
                    <Input
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      required
                    />
                    <Input
                      placeholder="Postal Code"
                      value={addressForm.postal_code}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, postal_code: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-tea-gold hover:bg-tea-gold/90"
                    disabled={createAddress.isPending}
                  >
                    {createAddress.isPending ? 'Saving...' : 'Save Address'}
                  </Button>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-600">No addresses saved yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add an address to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address: any) => (
                    <div key={address.id} className="p-4 border border-tea-gold/20 rounded-lg hover:border-tea-gold/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                        {address.is_default && (
                          <Badge className="bg-tea-gold text-white text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{address.street_address}</p>
                        {address.street_address2 && <p>{address.street_address2}</p>}
                        <p>
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                          {address.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Orders Section */}
            <Card className="p-6 border-0 shadow-sm">
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="text-tea-gold" size={28} />
                  Order History
                </h2>
                <p className="text-sm text-gray-600 mt-1">View and track your orders</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-600 font-medium">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start shopping to see your orders here</p>
                  <Button
                    className="mt-4 bg-tea-gold hover:bg-tea-gold/90"
                    onClick={() => navigate('/shop')}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-tea-gold/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-tea-gold">₹{(order.total_amount || 0).toFixed(2)}</p>
                          <Badge
                            className={`mt-1 text-xs ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600 mb-2">
                            {order.order_items.length} item{order.order_items.length > 1 ? 's' : ''}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.order_items.slice(0, 3).map((item: any) => (
                              <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {item.product?.name || 'Product'}
                              </span>
                            ))}
                            {order.order_items.length > 3 && (
                              <span className="text-xs text-gray-600 px-2 py-1">
                                +{order.order_items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-600">
                        <span>Click to view details</span>
                        <span>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
