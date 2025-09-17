'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface CampaignForm {
  name: string;
  description: string;
  cta_text: string;
  cta_url: string;
  thumbnail_file?: File;
  status: 'draft' | 'active' | 'paused' | 'completed';
  settings: {
    auto_play: boolean;
    show_controls: boolean;
    loop_video: boolean;
    muted_by_default: boolean;
  };
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const createCampaign = useCreateCampaign();
  
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    description: '',
    cta_text: '',
    cta_url: '',
    thumbnail_file: undefined,
    status: 'draft',
    settings: {
      auto_play: false,
      show_controls: true,
      loop_video: false,
      muted_by_default: true
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Campaign name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.cta_text.trim()) newErrors.cta_text = 'Call-to-action text is required';
    if (!form.cta_url.trim()) newErrors.cta_url = 'Call-to-action URL is required';
    
    // URL validation
    if (form.cta_url.trim()) {
      try {
        new URL(form.cta_url);
      } catch {
        newErrors.cta_url = 'Please enter a valid URL';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const campaignData = {
        name: form.name,
        description: form.description,
        cta_text: form.cta_text,
        cta_url: form.cta_url,
        thumbnail: form.thumbnail_file,
        is_active: form.status === 'active',
        settings: {
          autoplay: form.settings.auto_play,
          controls: form.settings.show_controls,
          loop: form.settings.loop_video,
          muted: form.settings.muted_by_default
        }
      };

      const campaign = await createCampaign.mutateAsync(campaignData);
      router.push('/campaigns');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to create campaign. Please try again.' });
      }
    }
  };

  const handleInputChange = (field: keyof CampaignForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSettingChange = (setting: keyof CampaignForm['settings'], value: boolean) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value }
    }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
            <p className="text-gray-600">Set up a new video campaign</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Campaign Name"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter campaign name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Describe your campaign"
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <Input
                label="Call-to-Action Text"
                value={form.cta_text}
                onChange={(e) => handleInputChange('cta_text', e.target.value)}
                error={errors.cta_text}
                placeholder="e.g., Learn More, Shop Now, Get Started"
                required
              />

              <Input
                label="Call-to-Action URL"
                value={form.cta_url}
                onChange={(e) => handleInputChange('cta_url', e.target.value)}
                error={errors.cta_url}
                placeholder="https://example.com"
                type="url"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleInputChange('thumbnail_file', file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.thumbnail && (
                  <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Upload an image to represent your campaign (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value as CampaignForm['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.settings.auto_play}
                    onChange={(e) => handleSettingChange('auto_play', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto-play videos</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.settings.show_controls}
                    onChange={(e) => handleSettingChange('show_controls', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show video controls</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.settings.loop_video}
                    onChange={(e) => handleSettingChange('loop_video', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Loop videos</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.settings.muted_by_default}
                    onChange={(e) => handleSettingChange('muted_by_default', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Muted by default</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link href="/campaigns">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={createCampaign.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}