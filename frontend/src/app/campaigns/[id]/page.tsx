'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaign, useDeleteCampaign } from '@/hooks/useCampaigns';
import { useVideos, useDeleteVideo } from '@/hooks/useVideos';
import { Video } from '@/types';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Play, 
  Eye, 
  Calendar,
  Settings,
  BarChart3,
  Video as VideoIcon,
  Share2,
  Copy
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import Link from 'next/link';
import { toast } from '@/components/ui/Toast';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const campaignIdNumber = parseInt(campaignId, 10);
  
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: 'campaign' | 'video';
    item: any;
  }>({
    isOpen: false,
    type: 'campaign',
    item: null
  });

  const [shareModal, setShareModal] = useState<{ isOpen: boolean; campaign: any | null }>({
    isOpen: false,
    campaign: null
  });

  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useCampaign(campaignIdNumber);
  const { data: videosData, isLoading: videosLoading } = useVideos(campaignIdNumber);
  const deleteCampaign = useDeleteCampaign();
  const deleteVideo = useDeleteVideo();

  const handleDeleteCampaign = async () => {
    if (!campaign) return;
    
    try {
      await deleteCampaign.mutateAsync(campaign.id);
      router.push('/campaigns');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!deleteModal.item) return;
    
    try {
      await deleteVideo.mutateAsync(deleteModal.item.id);
      setDeleteModal({ isOpen: false, type: 'video', item: null });
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleShare = (campaign: any) => {
    setShareModal({ isOpen: true, campaign });
  };

  const getShareableLink = (campaign: any) => {
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

  if (campaignLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
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
            <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
            <Link href="/campaigns">
              <Button>Back to Campaigns</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const settings = campaign.settings || {};
  const videos = videosData?.data || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.is_active ? 'active' : 'draft')}`}>
                  {campaign.is_active ? 'Active' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600">{campaign.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleShare(campaign)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href={`/campaigns/${campaign.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: true, type: 'campaign', item: campaign })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Campaign Overview - 40/60 Layout with Settings */}
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Campaign Thumbnail (40%) */}
            <div className="md:w-2/5">
              {campaign.thumbnail_url ? (
                <div className="h-full">
                  <img 
                    src={campaign.thumbnail_url} 
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '250px', maxHeight: '350px' }}
                  />
                </div>
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center" style={{ minHeight: '250px', maxHeight: '280px' }}>
                  <div className="text-center text-gray-400">
                    <VideoIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>No thumbnail available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side - Campaign Stats (60%) */}
            <div className="md:w-3/5 p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-4">Campaign Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Total Videos */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <VideoIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600">Total Videos</span>
                    </div>
                    <span className="text-2xl font-bold">{campaign.videos_count || 0}</span>
                  </div>
                  
                  {/* Total Views */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-600">Total Views</span>
                    </div>
                    <span className="text-2xl font-bold">{campaign.total_views || 0}</span>
                  </div>
                  
                  {/* CTA Clicks */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-600">CTA Clicks</span>
                    </div>
                    <span className="text-2xl font-bold">{campaign.total_cta_clicks || 0}</span>
                  </div>
                  
                  {/* Created */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-600">Created</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Campaign Settings */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-5 w-5 text-gray-700" />
                  <h3 className="text-lg font-semibold">Campaign Settings</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.autoplay ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Auto-play</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.controls ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Show Controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.loop ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Loop Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.muted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Muted by Default</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Videos Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Videos ({videos.length})</CardTitle>
              <Link href={`/campaigns/${campaign.id}/videos/create`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {videosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">
                <VideoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-600 mb-4">Add your first video to this campaign.</p>
                <Link href={`/campaigns/${campaign.id}/videos/create`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video: Video) => (
                  <div key={video.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Play className="h-8 w-8 mb-2" />
                          <span className="text-xs font-medium">No thumbnail</span>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>{formatFileSize(video.file_size || 0)}</span>
                      <span>{video.views || 0} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/videos/${video.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/videos/${video.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteModal({ isOpen: true, type: 'video', item: video })}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: 'campaign', item: null })}
        title={`Delete ${deleteModal.type === 'campaign' ? 'Campaign' : 'Video'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {deleteModal.type === 'campaign' ? (
              <>Are you sure you want to delete the campaign "{deleteModal.item?.name}"? 
              This action cannot be undone and will also delete all associated videos.</>
            ) : (
              <>Are you sure you want to delete the video "{deleteModal.item?.title}"? 
              This action cannot be undone.</>
            )}
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, type: 'campaign', item: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteModal.type === 'campaign' ? handleDeleteCampaign : handleDeleteVideo}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCampaign.isPending || deleteVideo.isPending}
            >
              {(deleteCampaign.isPending || deleteVideo.isPending) ? 'Deleting...' : `Delete ${deleteModal.type === 'campaign' ? 'Campaign' : 'Video'}`}
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
    </Layout>
  );
}