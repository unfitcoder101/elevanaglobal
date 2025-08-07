import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  onSuccess: () => void;
}

interface ProjectRequestForm {
  title: string;
  description: string;
  project_type: string;
  estimated_hours: number;
  estimated_cost: number;
  admin_notes: string;
}

const ProjectRequestModal: React.FC<ProjectRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  targetUserId,
  onSuccess 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectRequestForm>({
    title: '',
    description: '',
    project_type: '',
    estimated_hours: 0,
    estimated_cost: 0,
    admin_notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('estimated') ? Number(value) : value 
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, project_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_requests')
        .insert({
          admin_id: user.id,
          user_id: targetUserId,
          title: formData.title,
          description: formData.description,
          project_type: formData.project_type,
          estimated_hours: formData.estimated_hours,
          estimated_cost: formData.estimated_cost,
          admin_notes: formData.admin_notes,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Project request sent!",
        description: "The user will be notified and can accept or decline the project.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        project_type: '',
        estimated_hours: 0,
        estimated_cost: 0,
        admin_notes: ''
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating project request:', error);
      toast({
        title: "Error",
        description: "Failed to send project request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Project Request</DialogTitle>
          <DialogDescription>
            Create a project request that the user can accept or decline.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the project scope and requirements"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="project_type">Project Type *</Label>
            <Select onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-app">Mobile App</SelectItem>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
                <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                <SelectItem value="branding">Branding & Design</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                name="estimated_hours"
                type="number"
                placeholder="0"
                value={formData.estimated_hours || ''}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="estimated_cost">Estimated Cost (₹)</Label>
              <Input
                id="estimated_cost"
                name="estimated_cost"
                type="number"
                placeholder="0"
                value={formData.estimated_cost || ''}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="admin_notes">Admin Notes</Label>
            <Textarea
              id="admin_notes"
              name="admin_notes"
              placeholder="Internal notes for this project request"
              value={formData.admin_notes}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRequestModal;