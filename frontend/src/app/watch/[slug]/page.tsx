'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTrackEvent } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/Button';
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { Video, Campaign } from '@/types';

interface PublicVideoData {
  video: Video & { campaign: Campaign };
  variant?: 'A' | 'B';
}

export default function PublicVideoPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoData, setVideoData] = useState<PublicVideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const trackEvent = useTrackEvent();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/public/videos/${slug}`);
        setVideoData(response.data.data);
        
        // Track page view
        trackEvent.mutate({
          event_type: 'page_view',
          video_id: response.data.data.video.id,
          campaign_id: response.data.data.video.campaign_id,
          additional_data: {
            variant: response.data.data.variant || 'A',
            user_agent: navigator.userAgent,
            referrer: document.referrer || ''
          }
        });
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Video not found';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [slug]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoData) return;

    const settings = videoData.video.campaign.settings || {};

    // Apply campaign settings
    if (settings.autoplay) {
      video.autoplay = true;
    }
    if (settings.muted) {
      video.muted = true;
      setIsMuted(true);
    }
    if (settings.loop) {
      video.loop = true;
    }
    video.controls = settings.controls || false;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStarted) {
        setHasStarted(true);
        // Track video view
        trackEvent.mutate({
          event_type: 'video_play',
          video_id: videoData.video.id,
          campaign_id: videoData.video.campaign_id,
          additional_data: {
            variant: videoData.variant || 'A',
            user_agent: navigator.userAgent
          }
        });
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Track video completion
      trackEvent.mutate({
        event_type: 'video_complete',
        video_id: videoData.video.id,
        campaign_id: videoData.video.campaign_id,
        additional_data: {
          variant: videoData.variant || 'A',
          duration_watched: video.duration,
          user_agent: navigator.userAgent
        }
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoData, hasStarted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * video.duration;
    
    video.currentTime = newTime;
  };

  const handleCTAClick = () => {
    if (!videoData?.video.cta_url) return;

    // Track CTA click
    trackEvent.mutate({
      event_type: 'cta_click',
      video_id: videoData.video.id,
      campaign_id: videoData.video.campaign_id,
      additional_data: {
        variant: videoData.variant || 'A',
        cta_text: videoData.video.cta_text || '',
        cta_url: videoData.video.cta_url || '',
        user_agent: navigator.userAgent,
        timestamp: currentTime
      }
    });

    window.open(videoData.video.cta_url, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
          <p className="text-gray-400">{error || 'The video you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  const { video, variant } = videoData;
  const settings = video.campaign.settings || {};

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>{video.title} | {video.campaign.name}</title>
        <meta name="description" content={video.description} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:type" content="video.other" />
        <meta property="og:video" content={video.file_url} />
        {video.thumbnail_url && (
          <meta property="og:image" content={video.thumbnail_url} />
        )}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:description" content={video.description} />
        {video.thumbnail_url && (
          <meta name="twitter:image" content={video.thumbnail_url} />
        )}
      </head>

      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              poster={video.thumbnail_url || undefined}
              preload="metadata"
            >
              -                      <source src={video.file_url} type={video.mime_type || 'video/mp4'} />
              +                      <source src={video.file_url} type={video.mime_type ?? 'video/mp4'} />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls Overlay */}
            {!settings.controls && (
              <div className="absolute inset-0 flex items-center justify-center group">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 transition-all duration-200 group-hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </button>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-3"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <button
                      onClick={() => videoRef.current?.requestFullscreen()}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Call-to-Action Overlay */}
            {video.cta_text && video.cta_url && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={handleCTAClick}
                  className={`${
                    variant === 'B' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white shadow-lg`}
                >
                  {video.cta_text}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
            <p className="text-gray-400 mb-4">{video.description}</p>
            
            {/* Campaign Attribution */}
            <div className="text-sm text-gray-500">
              Part of <span className="text-gray-300">{video.campaign.name}</span> campaign
              {variant && (
                <span className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                  Variant {variant}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}