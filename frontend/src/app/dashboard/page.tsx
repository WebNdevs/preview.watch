'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Video, 
  BarChart3, 
  Users, 
  TrendingUp,
  Eye,
  MousePointer,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns(1, 5);
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsSummary();

  const stats = [
    {
      name: 'Total Campaigns',
      value: campaignsData?.total || 0,
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Views',
      value: analyticsData?.total_views || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'CTA Clicks',
      value: analyticsData?.total_cta_clicks || 0,
      icon: MousePointer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Conversion Rate',
      value: `${(analyticsData?.conversion_rate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 dashboard-container">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl -ml-20 -mb-20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Welcome back, {user?.name || 'System Administrator'}!
            </h1>
            <p className="text-lg text-white/90 font-medium">
              Here's an overview of your video campaigns and performance.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 dashboard-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full filter blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-xl shadow-md ${stat.bgColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.name}</p>
                      <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 card-grid-mobile">
              <Link href="/campaigns/new" className="group/button">
                <Button className="w-full justify-start h-14 transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl rounded-xl overflow-hidden relative" variant="outline">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="p-2 bg-blue-600/30 rounded-lg mr-3">
                      <Video className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Create New Campaign</span>
                  </div>
                </Button>
              </Link>
              <Link href="/campaigns" className="group/button">
                <Button className="w-full justify-start h-14 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl rounded-xl overflow-hidden relative" variant="outline">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="p-2 bg-green-600/30 rounded-lg mr-3">
                      <Play className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Manage Campaigns</span>
                  </div>
                </Button>
              </Link>
              <Link href="/analytics" className="group/button">
                <Button className="w-full justify-start h-14 transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl rounded-xl overflow-hidden relative" variant="outline">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <div className="p-2 bg-purple-600/30 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="font-medium">View Analytics</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card className="shadow-xl border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full filter blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">Recent Campaigns</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your latest video campaigns
                </CardDescription>
              </div>
              <Link href="/campaigns">
                <Button variant="outline" size="sm" className="transition-all duration-300 hover:shadow-md rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                  <span className="mr-1">View All</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m9 18 6-6-6-6"/></svg>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {campaignsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
                    <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="space-y-3 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : campaignsData?.data?.length ? (
              <div className="space-y-3">
                {campaignsData.data.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-xl group/item">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center shadow-md group-hover/item:shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-3">
                          <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-300">{campaign.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.videos?.length || 0} videos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        campaign.is_active ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-400' :
                        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800/30 dark:to-gray-700/30 dark:text-gray-400'
                      }`}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Link href={`/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm" className="transition-all duration-300 hover:shadow-md rounded-lg border border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20">
                          <span className="mr-1">View</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m9 18 6-6-6-6"/></svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
                  <Video className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No campaigns yet</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Get started by creating your first video campaign to engage your audience.
                </p>
                <div className="mt-6">
                  <Link href="/campaigns/new">
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 text-base font-medium">
                      <Video className="mr-2 h-5 w-5" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}