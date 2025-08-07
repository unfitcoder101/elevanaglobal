import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  onSuccess: () => Promise<void>;
}

const projectTypes = [
  { id: 'web-development', name: 'Web Development', estimatedHours: 40, cost: 25000 },
  { id: 'mobile-app', name: 'Mobile App Development', estimatedHours: 60, cost: 40000 },
  { id: 'ui-ux-design', name: 'UI/UX Design', estimatedHours: 20, cost: 15000 },
  { id: 'seo-optimization', name: 'SEO Optimization', estimatedHours: 15, cost: 10000 },
  { id: 'custom', name: 'Custom Project', estimatedHours: 30, cost: 20000 },
];

const ProjectRequestModal = ({ isOpen, onClose, targetUserId, onSuccess }: ProjectRequestModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: '',
    admin_notes: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProjectTypeChange = (value: string) => {
    const selectedType = projectTypes.find(type => type.id === value);
    setFormData(prev => ({
      ...prev,
      project_type: value,
      title: selectedType ? selectedType.name : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_type) {
      toast({
        title: "Error",
        description: "Please select a project type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const selectedType = projectTypes.find(type => type.id === formData.project_type);
      
      // Get current admin user id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('project_requests')
        .insert([{
          admin_id: user.id,
          user_id: targetUserId,
          title: formData.title,
          description: formData.description,
          project_type: formData.project_type,
          estimated_hours: selectedType?.estimatedHours,
          estimated_cost: selectedType?.cost,
          admin_notes: formData.admin_notes
        }]);

      if (error) throw error;

      toast({
        title: "Project request sent!",
        description: "The user will be notified and can accept or decline the project.",
      });
      
      await onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        project_type: '',
        admin_notes: ''
      });
    } catch (error) {
      console.error('Error creating project request:', error);
      toast({
        title: "Error",
        description: "Failed to create project request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = projectTypes.find(type => type.id === formData.project_type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Project Request</DialogTitle>
          <DialogDescription>
            Create a project request that the user can accept or decline.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={formData.project_type} onValueChange={handleProjectTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the project requirements..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">Admin Notes (Internal)</Label>
            <Textarea
              id="admin-notes"
              value={formData.admin_notes}
              onChange={(e) => handleInputChange('admin_notes', e.target.value)}
              placeholder="Internal notes for admin reference..."
              rows={2}
            />
          </div>

          {selectedType && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Project Estimate</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Estimated Hours:</span>
                  <p className="font-medium">{selectedType.estimatedHours} hours</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <p className="font-medium">₹{selectedType.cost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.project_type}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRequestModal;