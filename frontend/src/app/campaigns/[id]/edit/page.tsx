'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaign, useUpdateCampaign } from '@/hooks/useCampaigns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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
    player_size?: 'responsive' | 'small' | 'medium' | 'large';
  };
}

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useCampaign(parseInt(campaignId));
  const updateCampaign = useUpdateCampaign();
  
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
      muted_by_default: true,
      player_size: 'responsive'
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form with campaign data
  useEffect(() => {
    if (campaign && !isInitialized) {
      const settings = campaign.settings || {};
      setForm({
        name: campaign.name || '',
        description: campaign.description || '',
        cta_text: campaign.cta_text || '',
        cta_url: campaign.cta_url || '',
        thumbnail_file: undefined,
        status: campaign.is_active ? 'active' : 'draft',
        settings: {
          auto_play: settings.autoplay || false,
          show_controls: settings.controls !== undefined ? settings.controls : true,
          loop_video: settings.loop || false,
          muted_by_default: settings.muted !== undefined ? settings.muted : true
        }
      });
      setIsInitialized(true);
    }
  }, [campaign, isInitialized]);

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
      const updateData = {
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

      await updateCampaign.mutateAsync({ 
        id: parseInt(campaignId), 
        data: updateData 
      });
      
      router.push(`/campaigns/${campaignId}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to update campaign. Please try again.' });
      }
    }
  };

  const handleInputChange = (field: keyof CampaignForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSettingChange = (setting: keyof CampaignForm['settings'], value: boolean | string) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value }
    }));
  };

  if (campaignLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (campaignError || !campaign) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">The campaign you're trying to edit doesn't exist.</p>
            <Link href="/campaigns">
              <Button>Back to Campaigns</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-r from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100 mb-8">
          <Link href={`/campaigns/${campaignId}`} className="shrink-0">
            <Button variant="outline" size="sm" className="rounded-full h-12 w-12 p-0 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 border-blue-200 hover:border-blue-300">
              <ArrowLeft className="h-5 w-5 text-blue-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Edit Campaign
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Update your video campaign settings and preferences</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b pb-5">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                General Information
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Basic details about your campaign</p>
            </CardHeader>
            <CardContent className="space-y-8 pt-6 px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <div className="relative">
                    <Input
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={errors.name}
                      placeholder="Enter campaign name"
                      required
                      className="w-full h-14 px-4 py-2 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div className="col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <Textarea
                      value={form.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={errors.description}
                      placeholder="Describe your campaign"
                      rows={3}
                      required
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action Text
                  </label>
                  <div className="relative">
                    <Input
                      value={form.cta_text}
                      onChange={(e) => handleInputChange('cta_text', e.target.value)}
                      error={errors.cta_text}
                      placeholder="Enter call-to-action text"
                      required
                      className="w-full h-14 px-4 py-2 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  {errors.cta_text && (
                    <p className="text-sm text-red-600">{errors.cta_text}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action URL
                  </label>
                  <div className="relative">
                    <Input
                      type="url"
                      value={form.cta_url}
                      onChange={(e) => handleInputChange('cta_url', e.target.value)}
                      error={errors.cta_url}
                      placeholder="https://example.com"
                      required
                      className="w-full h-14 px-4 py-2 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    />
                  </div>
                  {errors.cta_url && (
                    <p className="text-sm text-red-600">{errors.cta_url}</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Campaign Thumbnail
                </label>
                <div className="relative border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center bg-blue-50/50 hover:bg-blue-50 transition-colors duration-200 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-blue-600 font-medium mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-3">Supported formats: PNG, JPG, GIF (max 5MB)</p>
                  <Button variant="outline" size="sm" className="bg-white shadow-sm hover:shadow-md border-blue-200 hover:border-blue-300 text-blue-600">
                    Choose File
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleInputChange('thumbnail_file', file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {form.thumbnail_file && (
                    <span className="text-xs text-blue-600 font-medium mt-2">{form.thumbnail_file.name}</span>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="text-sm text-red-600">{errors.thumbnail}</p>
                )}
              </div>

              <div className="col-span-2 md:col-span-1 space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => handleInputChange('status', e.target.value as CampaignForm['status'])}
                    className="w-full h-14 px-4 py-2 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none pr-10 bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Settings */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 mt-8">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b pb-5">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1V5h-1v2zm-2 8H7v-2h6v2zm2 0h1v-2h-1v2zm-8-6h6v4H7V7zm8 0h1v4h-1V7z" clipRule="evenodd" />
                </svg>
                Video Settings
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Configure video playback options and controls</p>
            </CardHeader>
            <CardContent className="pt-6 px-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-200">
                  <h3 className="text-base font-medium text-blue-700 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Playback Options
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-blue-50">
                      <input
                        type="checkbox"
                        checked={form.settings.auto_play}
                        onChange={(e) => handleSettingChange('auto_play', e.target.checked)}
                        className="w-5 h-5 rounded-md border-2 border-blue-300 text-blue-600 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Auto-play videos</span>
                        <span className="block text-xs text-gray-500 mt-1">Videos will play automatically when the page loads</span>
                      </div>
                    </label>

                    <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-blue-50">
                      <input
                        type="checkbox"
                        checked={form.settings.loop_video}
                        onChange={(e) => handleSettingChange('loop_video', e.target.checked)}
                        className="w-5 h-5 rounded-md border-2 border-blue-300 text-blue-600 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Loop videos</span>
                        <span className="block text-xs text-gray-500 mt-1">Videos will play repeatedly</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-200">
                  <h3 className="text-base font-medium text-blue-700 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    User Controls
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-blue-50">
                      <input
                        type="checkbox"
                        checked={form.settings.show_controls}
                        onChange={(e) => handleSettingChange('show_controls', e.target.checked)}
                        className="w-5 h-5 rounded-md border-2 border-blue-300 text-blue-600 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Show video controls</span>
                        <span className="block text-xs text-gray-500 mt-1">Display play, pause, and other video controls</span>
                      </div>
                    </label>

                    <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-blue-50">
                      <input
                        type="checkbox"
                        checked={form.settings.muted_by_default}
                        onChange={(e) => handleSettingChange('muted_by_default', e.target.checked)}
                        className="w-5 h-5 rounded-md border-2 border-blue-300 text-blue-600 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-800">Muted by default</span>
                        <span className="block text-xs text-gray-500 mt-1">Videos will start with sound off</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-blue-100">
                <h3 className="text-base font-medium text-blue-700 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1V5h-1v2zm-2 8H7v-2h6v2zm2 0h1v-2h-1v2zm-8-6h6v4H7V7z" clipRule="evenodd" />
                  </svg>
                  Display Settings
                </h3>
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Player Size
                    </label>
                    <div className="relative">
                      <select
                        value={form.settings.player_size || 'responsive'}
                        onChange={(e) => handleSettingChange('player_size', e.target.value)}
                        className="w-full h-12 px-4 py-2 border border-blue-200 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 shadow-sm appearance-none pr-10 bg-white"
                      >
                        <option value="responsive">Responsive (Default)</option>
                        <option value="small">Small (480p)</option>
                        <option value="medium">Medium (720p)</option>
                        <option value="large">Large (1080p)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md animate-pulse mt-8">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mt-0.5 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-base font-medium text-red-800 mb-2">There was a problem updating your campaign</h3>
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-4 mt-10 pt-6 border-t border-gray-200">
            <Link href={`/campaigns/${campaignId}`}>
              <Button variant="outline" size="lg" className="w-full md:w-auto min-w-[140px] border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 font-medium rounded-xl" 
              disabled={updateCampaign.isPending}
            >
              <Save className="h-5 w-5 mr-2" />
              {updateCampaign.isPending ? 'Updating...' : 'Update Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}