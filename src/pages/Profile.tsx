import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, User, Camera, Link, AlertTriangle } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } else if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, full_name: '' }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setProfile({ ...profile, full_name: fullName });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
      return 'File size must be less than 2MB';
    }
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
    }
    
    return null;
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validate file before upload
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "Invalid file",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`; // Organize files by user ID

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        let errorMessage = 'Failed to upload avatar. Please try again.';
        if (uploadError.message.includes('row-level security')) {
          errorMessage = 'Upload permission denied. Please contact support.';
        } else if (uploadError.message.includes('size')) {
          errorMessage = 'File is too large. Please use a file under 2MB.';
        }
        
        toast({
          title: "Upload failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);
      setPreviewUrl(null);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateAvatarFromUrl = async () => {
    if (!avatarUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Validate URL is an image
      const isValidImage = await validateImageUrl(avatarUrl);
      if (!isValidImage) {
        toast({
          title: "Invalid image URL",
          description: "The URL doesn't point to a valid image. Please check the URL and try again.",
          variant: "destructive",
        });
        return;
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      setAvatarUrl('');
      setPreviewUrl(null);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating avatar from URL:', error);
      toast({
        title: "Update failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewUrl = async (url: string) => {
    setAvatarUrl(url);
    if (url.trim()) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account details and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture or provide an image URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewUrl || profile?.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  {previewUrl && (
                    <p className="text-xs text-muted-foreground">Preview</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">
                        <Camera className="w-4 h-4 mr-2" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="url">
                        <Link className="w-4 h-4 mr-2" />
                        Image URL
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={uploadAvatar}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <Button variant="outline" disabled={uploading} className="w-full">
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <AlertTriangle className="w-3 h-3" />
                        <span>JPG, PNG, GIF, WebP (max. 2MB)</span>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="avatar-url">Image URL</Label>
                        <Input
                          id="avatar-url"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={avatarUrl}
                          onChange={(e) => handlePreviewUrl(e.target.value)}
                          disabled={uploading}
                        />
                      </div>
                      <Button 
                        onClick={updateAvatarFromUrl} 
                        disabled={uploading || !avatarUrl.trim()}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Link className="w-4 h-4 mr-2" />
                            Update Avatar
                          </>
                        )}
                      </Button>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Make sure the URL points to a valid image</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <Button
                onClick={updateProfile}
                disabled={saving}
                variant="gradient"
                className="w-full"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">User ID</p>
                  <p className="text-muted-foreground font-mono text-xs">{user?.id}</p>
                </div>
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-muted-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;