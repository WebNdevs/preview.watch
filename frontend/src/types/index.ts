export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'brand' | 'agency';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  campaigns?: Campaign[];
}

export interface Campaign {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description?: string;
  cta_text: string;
  cta_url: string;
  thumbnail_path?: string;
  thumbnail_url?: string;
  is_active: boolean;
  settings?: {
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
  };
  created_at: string;
  updated_at: string;
  user?: User;
  videos?: Video[];
  analytics?: Analytics[];
  // Computed properties
  videos_count?: number;
  total_views?: number;
  total_cta_clicks?: number;
}

export interface Video {
  id: number;
  campaign_id: number;
  title: string;
  slug: string;
  description?: string;
  file_path: string;
  thumbnail_path?: string;
  file_size: number;
  duration?: number;
  mime_type?: string;
  status: 'active' | 'draft' | 'inactive';
  views?: number;
  cta_text?: string;
  cta_url?: string;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  analytics?: Analytics[];
  // Computed properties
  file_url?: string;
  thumbnail_url?: string;
  formatted_file_size?: string;
  formatted_duration?: string;
}

export interface Analytics {
  id: number;
  campaign_id?: number;
  video_id?: number;
  event_type: 'video_play' | 'video_view' | 'video_complete' | 'cta_click' | 'page_view';
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  referrer?: string;
  additional_data?: Record<string, string | number | boolean | null>;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  video?: Video;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  role: 'brand' | 'agency';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CampaignFormData {
  name: string;
  description?: string;
  cta_text: string;
  cta_url: string;
  thumbnail?: File;
  is_active?: boolean;
  settings?: {
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
  };
}

export interface VideoFormData {
  campaign_id: number;
  title: string;
  description?: string;
  video_file: File;
  video_url?: string; // Added to track the URL of the uploaded video
  thumbnail?: File;
  duration?: number;
  is_active?: boolean;
  variant?: string;
  cta_url?: string;
  status?: 'active' | 'draft' | 'inactive';
}

export interface AnalyticsSummary {
  total_views: number;
  total_cta_clicks: number;
  unique_visitors: number;
  conversion_rate: number;
  engagement_rate: number;
  top_countries: Array<{ country: string; count: number }>;
  device_breakdown: Array<{ device_type: string; count: number }>;
  daily_stats: Array<{ date: string; views: number; clicks: number }>;
}