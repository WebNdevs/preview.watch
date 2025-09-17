import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  children
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {/* Illustration/Icon */}
      <div className="mb-6">
        {Icon ? (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Icon className="h-10 w-10 text-gray-400" />
          </div>
        ) : (
          <EmptyStateIllustration />
        )}
      </div>

      {/* Content */}
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-500 mb-6">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          className="mb-4"
        >
          {action.label}
        </Button>
      )}

      {/* Custom children */}
      {children}
    </div>
  );
};

// Default illustration component
const EmptyStateIllustration = () => (
  <svg
    className="mx-auto h-20 w-20 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    />
  </svg>
);

// Predefined empty states for common scenarios
const EmptyStateVariants = {
  campaigns: {
    title: "No campaigns yet",
    description: "Get started by creating your first video campaign to engage your audience."
  },
  videos: {
    title: "No videos uploaded",
    description: "Upload your first video to start building your campaign content."
  },
  users: {
    title: "No users found",
    description: "No users match your current search criteria. Try adjusting your filters."
  },
  analytics: {
    title: "No data available",
    description: "Analytics data will appear here once your campaigns start receiving engagement."
  },
  search: {
    title: "No results found",
    description: "We couldn't find anything matching your search. Try different keywords."
  }
};

export { EmptyState, EmptyStateVariants };