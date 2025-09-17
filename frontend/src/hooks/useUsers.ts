import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';

interface UsersParams {
  search?: string;
  role?: string;
  is_active?: string;
  per_page?: number;
  page?: number;
}

interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  is_active: boolean;
}

interface UpdateUserData {
  name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  is_active: boolean;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Get paginated users list
export const useUsers = (params: UsersParams = {}) => {
  return useQuery<PaginatedUsers>({
    queryKey: ['users', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.role) searchParams.append('role', params.role);
      if (params.is_active) searchParams.append('is_active', params.is_active);
      if (params.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params.page) searchParams.append('page', params.page.toString());
      
      const response = await api.get(`/users?${searchParams.toString()}`);
      return response.data;
    },
  });
};

// Get single user
export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      // Invalidate users list and specific user to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Get current user profile
export const useProfile = () => {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data.data;
    },
  });
};

// Update current user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<UpdateUserData>) => {
      const response = await api.put('/profile', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate profile and users list to refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};