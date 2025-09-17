import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Analytics, AnalyticsSummary, PaginatedResponse } from '@/types';

export function useAnalytics(
  campaignId?: number,
  videoId?: number,
  eventType?: string,
  page = 1,
  perPage = 10
) {
  return useQuery({
    queryKey: ['analytics', campaignId, videoId, eventType, page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (campaignId) params.append('campaign_id', campaignId.toString());
      if (videoId) params.append('video_id', videoId.toString());
      if (eventType) params.append('event_type', eventType);
      
      const response = await api.get<PaginatedResponse<Analytics>>(
        `/analytics?${params.toString()}`
      );
      return response.data;
    },
  });
}

export function useAnalyticsSummary(
  campaignId?: number,
  videoId?: number,
  dateFrom?: string,
  dateTo?: string
) {
  return useQuery({
    queryKey: ['analytics-summary', campaignId, videoId, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (campaignId) params.append('campaign_id', campaignId.toString());
      if (videoId) params.append('video_id', videoId.toString());
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      const response = await api.get<AnalyticsSummary>(
        `/analytics/summary?${params.toString()}`
      );
      return response.data;
    },
  });
}

export function useTrackEvent() {
  return useMutation({
    mutationFn: async (data: {
      campaign_id?: number;
      video_id?: number;
      event_type: 'video_play' | 'video_view' | 'video_complete' | 'cta_click' | 'page_view';
      additional_data?: Record<string, string | number | boolean | null>;
    }) => {
      const response = await api.post<Analytics>('/analytics', {
        ...data,
        ip_address: undefined, // Will be detected server-side
        user_agent: navigator.userAgent,
        referrer: document.referrer || undefined,
      });
      return response.data;
    },
  });
}

// Hook for real-time analytics (could be extended with WebSocket)
export function useRealTimeAnalytics(campaignId?: number) {
  return useQuery({
    queryKey: ['real-time-analytics', campaignId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campaignId) params.append('campaign_id', campaignId.toString());
      
      const response = await api.get<{
        active_viewers: number;
        recent_events: Analytics[];
      }>(`/analytics/real-time?${params.toString()}`);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Hook for analytics export
export function useExportAnalytics() {
  return useMutation({
    mutationFn: async (params: {
      campaign_id?: number;
      video_id?: number;
      date_from?: string;
      date_to?: string;
      format: 'csv' | 'xlsx';
    }) => {
      const response = await api.get('/analytics/export', {
        params,
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-export.${params.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
  });
}