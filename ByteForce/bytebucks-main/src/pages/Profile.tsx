import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Bell, 
  Shield, 
  Camera, 
  Save, 
  Loader2,
  Gavel,
  ShoppingCart,
  TrendingDown,
  Heart,
  UserPlus,
  ThumbsUp,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { PhoneVerification } from '@/components/auth/PhoneVerification';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile, updateNotificationPreferences, uploadAvatar } = useProfile();
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form values when profile loads
  useState(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
    }
  });

  // Update form when profile changes
  if (profile && !displayName && !username && !bio) {
    setDisplayName(profile.display_name || '');
    setUsername(profile.username || '');
    setBio(profile.bio || '');
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({
      display_name: displayName,
      username: username,
      bio: bio,
    });
    setSaving(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setUploadingAvatar(true);
    await uploadAvatar(file);
    setUploadingAvatar(false);
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    if (!profile?.notification_preferences) return;
    
    await updateNotificationPreferences({
      ...profile.notification_preferences,
      [key]: value,
    });
  };

  const getUserInitial = () => {
    if (profile?.display_name) return profile.display_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const notificationSettings = [
    { key: 'bid_received', label: 'Bid Received', description: 'When someone places a bid on your NFT', icon: Gavel },
    { key: 'bid_outbid', label: 'Outbid Alert', description: 'When you\'ve been outbid on an NFT', icon: Gavel },
    { key: 'sale', label: 'Sale Notification', description: 'When your NFT is sold', icon: ShoppingCart },
    { key: 'price_alert', label: 'Price Alerts', description: 'When watched items reach your target price', icon: TrendingDown },
    { key: 'wishlist_update', label: 'Wishlist Updates', description: 'When wishlisted items change in price', icon: Heart },
    { key: 'follow', label: 'New Followers', description: 'When someone follows you', icon: UserPlus },
    { key: 'like', label: 'Likes', description: 'When someone likes your NFT', icon: ThumbsUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-background gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-background gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-background gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Avatar Section */}
              <Card className="p-6 glass">
                <h3 className="font-serif font-semibold text-foreground mb-4">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-2 ring-primary/20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-serif">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={handleAvatarClick}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium mb-1">
                      Upload a new avatar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Profile Info */}
              <Card className="p-6 glass">
                <h3 className="font-serif font-semibold text-foreground mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Enter your display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        maxLength={30}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {bio.length}/500
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex justify-end">
                  <Button 
                    variant="elegant" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6 glass">
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Notification Preferences
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose which notifications you'd like to receive
                </p>

                <div className="space-y-4">
                  {notificationSettings.map((setting) => {
                    const isEnabled = profile?.notification_preferences?.[setting.key as keyof typeof profile.notification_preferences] ?? true;
                    
                    return (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <setting.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{setting.label}</p>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleNotificationToggle(setting.key, checked)}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Phone Verification */}
              <Card className="p-6 glass">
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Phone Verification
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Verify your phone number for additional security
                </p>

                {profile?.phone_verified ? (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {profile.phone_number}
                        </p>
                        <p className="text-sm text-emerald-500">Phone number verified</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PhoneVerification 
                    userId={user?.id} 
                    onVerified={() => {
                      // Refetch profile to update the phone verification status
                      window.location.reload();
                    }}
                  />
                )}
              </Card>

              <Card className="p-6 glass">
                <h3 className="font-serif font-semibold text-foreground mb-2">
                  Security Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Manage your account security
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Change Password</p>
                        <p className="text-sm text-muted-foreground">
                          Update your password regularly to keep your account secure
                        </p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Connected Wallets</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.wallet_address || 'No wallet connected'}
                        </p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 glass border-destructive/50">
                <h3 className="font-serif font-semibold text-destructive mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Irreversible actions that affect your account
                </p>
                <Button variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Delete Account
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
