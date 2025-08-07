import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Mail, User, Send, X } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSearchModal = ({ isOpen, onClose }: UserSearchModalProps) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    project_type: 'custom',
    estimated_cost: '',
    estimated_hours: ''
  });
  const { toast } = useToast();

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*');

      // If search term provided, filter by name or email
      if (searchEmail.trim()) {
        query = query.or(`full_name.ilike.%${searchEmail}%,email.ilike.%${searchEmail}%`);
      }

      const { data: profiles, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setSearchResults(profiles || []);
      
      if (!profiles || profiles.length === 0) {
        toast({
          title: "No users found",
          description: searchEmail.trim() ? "No users found matching that search term" : "No users found in the system",
        });
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to search users.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendProjectRequest = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user first",
        variant: "destructive",
      });
      return;
    }

    if (!projectForm.title || !projectForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('project_requests')
        .insert([{
          user_id: selectedUser.user_id,
          admin_id: user.id,
          title: projectForm.title,
          description: projectForm.description,
          project_type: projectForm.project_type,
          estimated_cost: projectForm.estimated_cost ? parseFloat(projectForm.estimated_cost) : null,
          estimated_hours: projectForm.estimated_hours ? parseInt(projectForm.estimated_hours) : null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Project request sent to ${selectedUser.full_name || 'user'}`,
      });

      // Reset form
      setProjectForm({
        title: '',
        description: '',
        project_type: 'custom',
        estimated_cost: '',
        estimated_hours: ''
      });
      setSelectedUser(null);
      setSearchResults([]);
      setSearchEmail('');
      onClose();

    } catch (error) {
      console.error('Error sending project request:', error);
      toast({
        title: "Error",
        description: "Failed to send project request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto mx-4 w-[95vw] sm:w-[90vw]">
        <DialogHeader>
          <DialogTitle>Send Project Request to User</DialogTitle>
          <DialogDescription>
            Search for a user and send them a project request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or email (leave empty to show all users)..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                />
                <Button onClick={searchUsers} disabled={isLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Tip: Leave search empty and click search to see all users
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Search Results:</h4>
                  {searchResults.map((profile) => (
                    <div
                      key={profile.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedUser?.id === profile.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedUser(profile)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <span className="font-medium">
                              {profile.full_name || 'No name set'}
                            </span>
                            {profile.email && (
                              <div className="text-sm text-muted-foreground">
                                {profile.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">
                          ID: {profile.user_id.slice(0, 8)}...
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Created: {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Request Form */}
          {selectedUser && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Project Request for {selectedUser.full_name || 'User'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project requirements and scope"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated_cost">Estimated Cost (₹)</Label>
                    <Input
                      id="estimated_cost"
                      type="number"
                      placeholder="50000"
                      value={projectForm.estimated_cost}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, estimated_cost: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated_hours">Estimated Hours</Label>
                    <Input
                      id="estimated_hours"
                      type="number"
                      placeholder="40"
                      value={projectForm.estimated_hours}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, estimated_hours: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={sendProjectRequest} disabled={isLoading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Project Request
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchModal;