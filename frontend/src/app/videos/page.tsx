'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Play, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Video as VideoIcon,
  Target
} from 'lucide-react';
import { api } from '@/lib/api';
import { Video, Campaign } from '@/types';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { EmptyState, EmptyStateVariants } from '@/components/ui/EmptyState';
import { AdvancedFilters, videoFilterOptions, FilterPreset } from '@/components/ui/AdvancedFilters';
import { useVideoShortcuts } from '@/hooks/useKeyboardShortcuts';

interface VideoWithCampaign extends Video {
  campaign: Campaign;
}

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/videos');
      setVideos(response.data.data);
    } catch (err: any) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos(videos.filter(video => video.id !== videoId));
    } catch (err: any) {
      alert('Failed to delete video');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const toggleVideoSelection = (videoId: number) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllVideos = () => {
    const allIds = new Set(filteredVideos.map(v => v.id));
    setSelectedVideos(allIds);
    setShowBulkActions(true);
  };

  const clearSelection = () => {
    setSelectedVideos(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete videos:', Array.from(selectedVideos));
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
    localStorage.setItem('videoFilterPresets', JSON.stringify([...filterPresets, newPreset]));
  };

  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = filterPresets.filter(p => p.id !== presetId);
    setFilterPresets(updatedPresets);
    localStorage.setItem('videoFilterPresets', JSON.stringify(updatedPresets));
  };

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('videoFilterPresets');
    if (savedPresets) {
      setFilterPresets(JSON.parse(savedPresets));
    }
  }, [loading]);

  // Enable page-specific keyboard shortcuts
  useVideoShortcuts({
    onSelectAll: selectAllVideos,
    onClearSelection: clearSelection,
    onDelete: handleBulkDelete,
    onFilter: () => setShowAdvancedFilters(true)
  });

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-onboarding="videos-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
      </div>
      
      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleApplyFilters}
        onSavePreset={handleSavePreset}
        onDeletePreset={handleDeletePreset}
        filterOptions={videoFilterOptions}
        presets={filterPresets}
        currentFilters={activeFilters}
      />
    </Layout>
  );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
            <p className="text-gray-600">Manage all your video content</p>
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
            <Link href="/videos/upload">
              <Button data-onboarding="upload-video">
                <Plus className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </Link>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedVideos.size} video{selectedVideos.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                {filteredVideos.length > 0 && (
                  <Button variant="outline" size="sm" onClick={selectAllVideos}>
                    Select All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        {error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchVideos}>Try Again</Button>
            </CardContent>
          </Card>
        ) : filteredVideos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title={searchTerm || statusFilter !== 'all' ? 'No videos found' : EmptyStateVariants.videos.title}
            description={searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : EmptyStateVariants.videos.description
            }
            action={(!searchTerm && statusFilter === 'all') ? {
              label: "Go to Campaigns",
              onClick: () => window.location.href = '/campaigns',
              variant: 'primary'
            } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className={`group hover:shadow-lg transition-shadow duration-200 relative ${
                 selectedVideos.has(video.id) ? 'ring-2 ring-blue-500' : ''
               }`}>
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedVideos.has(video.id)}
                      onChange={() => toggleVideoSelection(video.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Target className="h-8 w-8 mb-2" />
                        <span className="text-xs font-medium">No thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      video.status === 'active' ? 'bg-green-100 text-green-800' :
                      video.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Campaign: {video.campaign.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.views || 0}</span>
                        </div>
                        {video.file_size && (
                          <span>{formatFileSize(video.file_size)}</span>
                        )}
                        {video.duration && (
                          <span>{formatDuration(video.duration)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
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
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredVideos.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Showing {filteredVideos.length} of {videos.length} videos</span>
                <div className="flex gap-4">
                  <span>Active: {videos.filter(v => v.status === 'active').length}</span>
                  <span>Draft: {videos.filter(v => v.status === 'draft').length}</span>
                  <span>Total Views: {videos.reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}