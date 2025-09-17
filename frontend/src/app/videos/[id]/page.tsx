'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVideo, useDeleteVideo } from '@/hooks/useVideos';
import { useAnalytics } from '@/hooks/useAnalytics';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Eye, 
  MousePointer,
  Calendar,
  FileVideo,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { formatFileSize, formatDuration } from '@/lib/utils';
import Link from 'next/link';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = parseInt(params.id as string);
  
  const [deleteModal, setDeleteModal] = useState(false);

  const { data: video, isLoading: videoLoading, error: videoError } = useVideo(videoId);
  const { data: analytics } = useAnalytics(
    undefined, // campaignId
    videoId,   // videoId
    undefined, // eventType
    1,         // page
    10         // perPage
  );
  const deleteVideo = useDeleteVideo();

  const handleDelete = async () => {
    if (!video) return;
    
    try {
      await deleteVideo.mutateAsync(video.id);
      router.push(`/campaigns/${video.campaign_id}`);
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'video_view': return 'bg-blue-100 text-blue-800';
      case 'cta_click': return 'bg-green-100 text-green-800';
      case 'video_complete': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (videoLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
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
        </div>
      </Layout>
    );
  }

  if (videoError || !video) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Video Not Found</h2>
            <p className="text-gray-600 mb-4">The video you're looking for doesn't exist.</p>
            <Link href="/campaigns">
              <Button>Back to Campaigns</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const ctaClicks = analytics?.data
  ? analytics.data.filter((e) => e.event_type === 'cta_click').length
  : 0;
  
  const conversionRate = video.views && ctaClicks
  ? ((ctaClicks / video.views) * 100).toFixed(1)
  : '0';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/campaigns/${video.campaign_id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaign
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <p className="text-gray-600">{video.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/videos/${video.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setDeleteModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  {video.file_url ? (
                    <video 
                      controls 
                      className="w-full h-full rounded-lg"
                      poster={video.thumbnail_url || undefined}
                    >
                      <source src={video.file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Video file not available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">File Size</label>
                    <p className="text-sm text-gray-900">{formatFileSize(video.file_size || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-sm text-gray-900">{formatDuration(video.duration || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Format</label>
                    <p className="text-sm text-gray-900">{video.mime_type || 'Unknown'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm text-gray-900">
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Call-to-Action */}
                {video.cta_text && video.cta_url && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-500">Call-to-Action</label>
                    <div className="mt-2 flex items-center gap-2">
                      <a href={video.cta_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm">
                          {video.cta_text}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                      <span className="text-xs text-gray-500">{video.cta_url}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Views</span>
                  </div>
                  <span className="text-lg font-semibold">{video.views || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">CTA Clicks</span>
                  </div>
                  <span className="text-lg font-semibold">{ctaClicks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Conversion</span>
                  </div>
                  <span className="text-lg font-semibold">{conversionRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{video.campaign?.name}</p>
                  <p className="text-sm text-gray-600">{video.campaign?.description}</p>
                  <Link href={`/campaigns/${video.campaign_id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Campaign
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.data.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics?.data.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {new Date(event.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {analytics && analytics.data.length > 5 && (
                      <Link href={`/analytics?video=${video.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          View All Activity
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Video"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the video "{video.title}"? 
            This action cannot be undone and will also delete all associated analytics data.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteVideo.isPending}
            >
              {deleteVideo.isPending ? 'Deleting...' : 'Delete Video'}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}