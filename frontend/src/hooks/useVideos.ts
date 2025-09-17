import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Video, VideoFormData, PaginatedResponse } from '@/types';

export function useVideos(campaignId?: number, page = 1, perPage = 10) {
  return useQuery({
    queryKey: ['videos', campaignId, page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (campaignId) {
        params.append('campaign_id', campaignId.toString());
      }
      
      const response = await api.get<PaginatedResponse<Video>>(
        `/videos?${params.toString()}`
      );
      return response.data;
    },
  });
}

export function useVideo(id: number) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const response = await api.get(`/videos/${id}`);
      // The API returns data in a nested 'data' property
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: VideoFormData) => {
      const formData = new FormData();
      
      formData.append('campaign_id', data.campaign_id.toString());
      formData.append('name', data.title);
      
      // Include CTA fields if provided
      if ((data as any).cta_text !== undefined) {
        formData.append('cta_text', (data as any).cta_text || '');
      }
      if ((data as any).cta_url !== undefined) {
        formData.append('cta_url', (data as any).cta_url || '');
      }
      
      // Only include video_file if it's a new file (not already uploaded)
      if (data.video_file && (!data.video_url || (data.video_file as any).objectURL !== data.video_url)) {
        formData.append('video_file', data.video_file);
      }
      
      if ('variant' in data && (data as any).variant) {
        formData.append('variant', (data as any).variant as string);
      }
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if ((data as any).thumbnail) {
        formData.append('thumbnail', (data as any).thumbnail);
      }
      
      if ((data as any).duration) {
        formData.append('duration', (data as any).duration.toString());
      }
      
      if ('is_active' in data && (data as any).is_active !== undefined) {
        formData.append('is_active', (data as any).is_active ? '1' : '0');
      }
      
      const response = await api.post<Video>('/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos', data.campaign_id] });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<VideoFormData> & { cta_text?: string; cta_url?: string } }) => {
      const formData = new FormData();
      
      // Send all available fields to the backend
      if (data.campaign_id) formData.append('campaign_id', data.campaign_id.toString());
      
      // Always send name/title, even if empty
      formData.append('name', data.title || '');
      
      // Always send description, even if empty
      formData.append('description', data.description || '');
      
      // Always send cta_text and cta_url, even if they're empty
      formData.append('cta_text', data.cta_text || '');
      formData.append('cta_url', data.cta_url || '');
      
      // Only include video_file if it's a new file (not already uploaded)
      // Check if the video_file has an objectURL property that matches the video_url
      // If they match, the file was already uploaded and we don't need to upload it again
      if (data.video_file && (!data.video_url || data.video_file.objectURL !== data.video_url)) {
        formData.append('video_file', data.video_file);
      }
      
      if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
      if (data.duration) formData.append('duration', data.duration.toString());
      if ('variant' in data && data.variant) formData.append('variant', data.variant as string);
      
      // Always send is_active status
      formData.append('is_active', data.is_active ? '1' : '0');
      
      // Laravel requires _method for PUT with FormData
      formData.append('_method', 'PUT');
      
      const response = await api.post<Video>(`/videos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos', data.campaign_id] });
      queryClient.invalidateQueries({ queryKey: ['video', data.id] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}