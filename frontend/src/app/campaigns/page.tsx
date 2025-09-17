'use client';

import { useState } from 'react';
import { useCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns';
import { Campaign } from '@/types';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Eye, Calendar, Target, Share2, Copy, Filter } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import Link from 'next/link';
import { toast } from '@/components/ui/Toast';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState, EmptyStateVariants } from '@/components/ui/EmptyState';
import { AdvancedFilters, campaignFilterOptions, FilterPreset } from '@/components/ui/AdvancedFilters';
import { useCampaignShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEffect } from 'react';

export default function CampaignsPage() {
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null
  });
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);

  const { data: campaignsData, isLoading, error } = useCampaigns(page, 12);
  const deleteCampaign = useDeleteCampaign();

  const handleDelete = async () => {
    if (!deleteModal.campaign) return;
    
    try {
      await deleteCampaign.mutateAsync(deleteModal.campaign.id);
      setDeleteModal({ isOpen: false, campaign: null });
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleShare = (campaign: Campaign) => {
    setShareModal({ isOpen: true, campaign });
  };

  const toggleCampaignSelection = (campaignId: number) => {
    const newSelected = new Set(selectedCampaigns);
    if (newSelected.has(campaignId)) {
      newSelected.delete(campaignId);
    } else {
      newSelected.add(campaignId);
    }
    setSelectedCampaigns(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllCampaigns = () => {
    if (campaignsData?.data) {
      const allIds = new Set(campaignsData.data.map(c => c.id));
      setSelectedCampaigns(allIds);
      setShowBulkActions(true);
    }
  };

  const clearSelection = () => {
    setSelectedCampaigns(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    // Implementation for bulk delete
    console.log('Bulk delete:', Array.from(selectedCampaigns));
    clearSelection();
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    // Here you would typically refetch data with the new filters
    console.log('Applied filters:', filters);
  };

  const handleSavePreset = (name: string, filters: Record<string, any>) => {
    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name,
      filters
    };
    setFilterPresets(prev => [...prev, newPreset]);
    // Save to localStorage or API
    localStorage.setItem('campaignFilterPresets', JSON.stringify([...filterPresets, newPreset]));
  };

  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = filterPresets.filter(p => p.id !== presetId);
    setFilterPresets(updatedPresets);
    localStorage.setItem('campaignFilterPresets', JSON.stringify(updatedPresets));
  };

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('campaignFilterPresets');
    if (savedPresets) {
      setFilterPresets(JSON.parse(savedPresets));
    }
  }, []);

  // Enable page-specific keyboard shortcuts
  useCampaignShortcuts({
    onSelectAll: selectAllCampaigns,
    onClearSelection: clearSelection,
    onDelete: handleBulkDelete,
    onFilter: () => setShowAdvancedFilters(true)
  });

  const getShareableLink = (campaign: Campaign) => {
    if (!campaign.user?.username || !campaign.slug) return '';
    return `${window.location.origin}/${campaign.user.username}/${campaign.slug}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Campaigns</h2>
            <p className="text-gray-600">Failed to load campaigns. Please try again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">Manage your video campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvancedFilters(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {Object.keys(activeFilters).some(key => activeFilters[key]) && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {Object.keys(activeFilters).filter(key => activeFilters[key]).length}
                </span>
              )}
            </Button>
            <Link href="/campaigns/create">
              <Button className="flex items-center gap-2" data-onboarding="create-campaign">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedCampaigns.size} campaign{selectedCampaigns.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Select All */}
        {!isLoading && campaignsData?.data && campaignsData.data.length > 0 && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={selectAllCampaigns}>
              Select All
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Campaigns Grid */}
        {!isLoading && campaignsData && (
          <>
            {campaignsData.data.length === 0 ? (
              <EmptyState
                icon={Target}
                title={EmptyStateVariants.campaigns.title}
                description={EmptyStateVariants.campaigns.description}
                action={{
                  label: "Create Campaign",
                  onClick: () => window.location.href = '/campaigns/create',
                  variant: 'primary'
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-onboarding="campaigns-grid">
                {campaignsData.data.map((campaign) => (
                  <Card key={campaign.id} className={`hover:shadow-lg transition-shadow overflow-hidden relative ${
                    selectedCampaigns.has(campaign.id) ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.has(campaign.id)}
                        onChange={() => toggleCampaignSelection(campaign.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    {/* Thumbnail - always show with placeholder if no image */}
                    <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                      {campaign.thumbnail_url ? (
                        <img 
                          src={campaign.thumbnail_url} 
                          alt={campaign.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Target className="h-8 w-8 mb-2" />
                          <span className="text-sm">No thumbnail</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.is_active ? 'active' : 'draft')}`}>
                          {campaign.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Campaign Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Videos:</span>
                            <span className="ml-1 font-medium">{campaign.videos_count || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Views:</span>
                            <span className="ml-1 font-medium">{campaign.total_views || 0}</span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created {new Date(campaign.created_at).toLocaleDateString()}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/campaigns/${campaign.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(campaign)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteModal({ isOpen: true, campaign })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {campaignsData.last_page > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {campaignsData.last_page}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === campaignsData.last_page}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, campaign: null })}
        title="Delete Campaign"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the campaign "{deleteModal.campaign?.name}"? 
            This action cannot be undone and will also delete all associated videos.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, campaign: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCampaign.isPending}
            >
              {deleteCampaign.isPending ? 'Deleting...' : 'Delete Campaign'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Campaign Modal */}
      <Modal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, campaign: null })}
        title="Share Campaign"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this campaign with others using the link below:
          </p>
          {shareModal.campaign && (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Campaign Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={getShareableLink(shareModal.campaign)}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(getShareableLink(shareModal.campaign!))}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>This link will show the campaign with round-robin video playback.</p>
                <p>Viewers can watch all videos in the campaign sequentially.</p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShareModal({ isOpen: false, campaign: null })}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
         isOpen={showAdvancedFilters}
         onClose={() => setShowAdvancedFilters(false)}
         onApply={handleApplyFilters}
         onSavePreset={handleSavePreset}
         onDeletePreset={handleDeletePreset}
         filterOptions={campaignFilterOptions}
         presets={filterPresets}
         currentFilters={activeFilters}
       />
    </Layout>
  );
}