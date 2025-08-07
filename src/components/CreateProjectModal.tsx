import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Globe, Smartphone, Zap, BarChart3 } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
  userId: string;
}

const projectTypes = [
  { id: 'website-fullstack', name: 'Website Creation - Full Stack', icon: <Globe className="w-4 h-4" />, estimatedHours: 120, estimatedCost: 45000 },
  { id: 'website-frontend', name: 'Website Creation - Frontend Only', icon: <Globe className="w-4 h-4" />, estimatedHours: 80, estimatedCost: 28000 },
  { id: 'mobile-app', name: 'Mobile App Development', icon: <Smartphone className="w-4 h-4" />, estimatedHours: 200, estimatedCost: 75000 },
  { id: 'business-automation', name: 'Business Automation', icon: <Zap className="w-4 h-4" />, estimatedHours: 60, estimatedCost: 35000 },
  { id: 'social-media-boost', name: 'Social Media Boost', icon: <BarChart3 className="w-4 h-4" />, estimatedHours: 40, estimatedCost: 15000 },
  { id: 'business-boost', name: 'Complete Business Boost', icon: <BarChart3 className="w-4 h-4" />, estimatedHours: 100, estimatedCost: 55000 }
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectTypeChange = (value: string) => {
    const selectedType = projectTypes.find(type => type.id === value);
    if (selectedType) {
      setFormData({
        ...formData,
        project_type: value,
        title: selectedType.name
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedType = projectTypes.find(type => type.id === formData.project_type);
      
      const { error } = await supabase
        .from('projects')
        .insert([{
          user_id: userId,
          title: formData.title,
          description: formData.description,
          project_type: formData.project_type,
          estimated_hours: selectedType?.estimatedHours || 0,
          estimated_cost: selectedType?.estimatedCost || 0,
          notes: formData.notes,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Project created successfully!",
        description: `Project "${formData.title}" has been created and assigned to the user.`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        project_type: '',
        notes: ''
      });

      onProjectCreated();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = projectTypes.find(type => type.id === formData.project_type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Create a new project for this user with detailed specifications.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Project Type</Label>
            <Select onValueChange={handleProjectTypeChange} value={formData.project_type}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estimated Hours:</span>
                  <p className="text-primary">{selectedType.estimatedHours} hours</p>
                </div>
                <div>
                  <span className="font-medium">Estimated Cost:</span>
                  <p className="text-primary">₹{selectedType.estimatedCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detailed project description and requirements..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Internal notes for the project team..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading || !formData.project_type}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;