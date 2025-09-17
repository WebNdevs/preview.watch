import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Campaign, CampaignFormData, PaginatedResponse } from '@/types';

export function useCampaigns(page = 1, perPage = 10) {
  return useQuery({
    queryKey: ['campaigns', page, perPage],
    queryFn: async () => {
      console.log('🔍 useCampaigns: Fetching campaigns', { page, perPage });
      
      try {
        const response = await api.get<PaginatedResponse<Campaign>>(
          `/campaigns?page=${page}&per_page=${perPage}`
        );
        
        console.log('✅ useCampaigns: Successfully fetched campaigns', {
          total: response.data.total,
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          campaignCount: response.data.data.length,
          campaigns: response.data.data.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
        });
        
        return response.data;
      } catch (error) {
        console.error('❌ useCampaigns: Failed to fetch campaigns', {
          page,
          perPage,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
  });
}

export function useCampaign(id: number) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      console.log('🔍 useCampaign: Fetching single campaign', { campaignId: id });
      
      try {
        const response = await api.get<{data: Campaign}>(`/campaigns/${id}`);
        
        console.log('✅ useCampaign: Successfully fetched campaign', {
          campaignId: response.data.data.id,
          name: response.data.data.name,
          slug: response.data.data.slug,
          isActive: response.data.data.is_active,
          videosCount: response.data.data.videos?.length || 0,
          hasCtaText: !!response.data.data.cta_text,
          hasCtaUrl: !!response.data.data.cta_url,
          hasThumbnail: !!response.data.data.thumbnail_path
        });
        
        return response.data.data;
      } catch (error) {
        console.error('❌ useCampaign: Failed to fetch campaign', {
          campaignId: id,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CampaignFormData) => {
      console.log('🚀 useCreateCampaign: Starting campaign creation', {
        name: data.name,
        ctaText: data.cta_text,
        ctaUrl: data.cta_url,
        hasDescription: !!data.description,
        hasThumbnail: !!data.thumbnail,
        isActive: data.is_active,
        settings: data.settings
      });
      
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('cta_text', data.cta_text);
      formData.append('cta_url', data.cta_url);
      
      if (data.description) {
        formData.append('description', data.description);
        console.log('📝 useCreateCampaign: Added description to form data');
      }
      
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
        console.log('🖼️ useCreateCampaign: Added thumbnail to form data', {
          fileName: data.thumbnail.name,
          fileSize: data.thumbnail.size,
          fileType: data.thumbnail.type
        });
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
        console.log('🔄 useCreateCampaign: Set active status', { isActive: data.is_active });
      }
      
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(`settings[${key}]`, value ? '1' : '0');
          }
        });
        console.log('⚙️ useCreateCampaign: Added settings to form data', data.settings);
      }
      
      try {
        console.log('📤 useCreateCampaign: Sending POST request to /campaigns');
        
        const response = await api.post<{message: string; data: Campaign}>('/campaigns', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const campaign = response.data.data;
        console.log('✅ useCreateCampaign: Campaign created successfully', {
          campaignId: campaign.id,
          name: campaign.name,
          slug: campaign.slug,
          isActive: campaign.is_active
        });
        
        return campaign;
      } catch (error) {
        console.error('❌ useCreateCampaign: Failed to create campaign', {
          campaignName: data.name,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 useCreateCampaign: Invalidating campaigns cache after successful creation', {
        createdCampaignId: data.id
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error) => {
      console.error('❌ useCreateCampaign: Mutation failed', {
        error: error instanceof Error ? error.message : error
      });
    }
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CampaignFormData> }) => {
      console.log('🔄 useUpdateCampaign: Starting campaign update', {
        campaignId: id,
        updateFields: Object.keys(data),
        name: data.name,
        ctaText: data.cta_text,
        ctaUrl: data.cta_url,
        hasDescription: !!data.description,
        hasThumbnail: !!data.thumbnail,
        isActive: data.is_active,
        settings: data.settings
      });
      
      const formData = new FormData();
      
      if (data.name) {
        formData.append('name', data.name);
        console.log('📝 useUpdateCampaign: Updating name', { newName: data.name });
      }
      if (data.cta_text) {
        formData.append('cta_text', data.cta_text);
        console.log('🎯 useUpdateCampaign: Updating CTA text');
      }
      if (data.cta_url) {
        formData.append('cta_url', data.cta_url);
        console.log('🔗 useUpdateCampaign: Updating CTA URL');
      }
      if (data.description) {
        formData.append('description', data.description);
        console.log('📄 useUpdateCampaign: Updating description');
      }
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
        console.log('🖼️ useUpdateCampaign: Updating thumbnail', {
          fileName: data.thumbnail.name,
          fileSize: data.thumbnail.size,
          fileType: data.thumbnail.type
        });
      }
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
        console.log('🔄 useUpdateCampaign: Updating active status', { isActive: data.is_active });
      }
      
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(`settings[${key}]`, value ? '1' : '0');
          }
        });
        console.log('⚙️ useUpdateCampaign: Updating settings', data.settings);
      }
      
      // Laravel requires _method for PUT with FormData
      formData.append('_method', 'PUT');
      
      try {
        console.log('📤 useUpdateCampaign: Sending PUT request', { campaignId: id });
        
        const response = await api.post<Campaign>(`/campaigns/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('✅ useUpdateCampaign: Campaign updated successfully', {
          campaignId: response.data.id,
          name: response.data.name,
          slug: response.data.slug,
          isActive: response.data.is_active
        });
        
        return response.data;
      } catch (error) {
        console.error('❌ useUpdateCampaign: Failed to update campaign', {
          campaignId: id,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 useUpdateCampaign: Invalidating cache after successful update', {
        updatedCampaignId: data.id
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
    },
    onError: (error) => {
      console.error('❌ useUpdateCampaign: Mutation failed', {
        error: error instanceof Error ? error.message : error
      });
    }
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ useDeleteCampaign: Starting campaign deletion', { campaignId: id });
      
      try {
        await api.delete(`/campaigns/${id}`);
        
        console.log('✅ useDeleteCampaign: Campaign deleted successfully', { campaignId: id });
      } catch (error) {
        console.error('❌ useDeleteCampaign: Failed to delete campaign', {
          campaignId: id,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log('🔄 useDeleteCampaign: Invalidating cache after successful deletion', {
        deletedCampaignId: id
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error, id) => {
      console.error('❌ useDeleteCampaign: Mutation failed', {
        campaignId: id,
        error: error instanceof Error ? error.message : error
      });
    }
  });
}