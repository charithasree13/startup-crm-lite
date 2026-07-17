/**
 * LoadingSkeleton Component
 * Animated pulse skeleton placeholders for the Analytics Dashboard.
 * Renders card and chart skeletons while data is loading.
 */

import { memo } from 'react';

/** Single skeleton block with configurable size */
const SkeletonBlock = memo(({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
));
SkeletonBlock.displayName = 'SkeletonBlock';

/** KPI card skeleton */
const StatCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3 shadow-sm">
    <div className="flex items-center justify-between">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-10 w-10 rounded-xl" />
    </div>
    <SkeletonBlock className="h-8 w-32" />
    <SkeletonBlock className="h-3 w-20" />
  </div>
));
StatCardSkeleton.displayName = 'StatCardSkeleton';

/** Chart panel skeleton */
const ChartSkeleton = memo(({ tall = false }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm ${tall ? 'h-96' : 'h-72'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3 w-56" />
      </div>
      <SkeletonBlock className="h-8 w-20 rounded-lg" />
    </div>
    <div className="flex items-end gap-3 h-40 mt-6">
      {[60, 80, 45, 90, 70, 55, 85, 65].map((h, i) => (
        <SkeletonBlock
          key={i}
          className="flex-1 rounded-lg"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
));
ChartSkeleton.displayName = 'ChartSkeleton';

/** Full analytics dashboard skeleton layout */
export const LoadingSkeleton = memo(() => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <SkeletonBlock className="h-8 w-64" />
      <SkeletonBlock className="h-4 w-80" />
    </div>

    {/* Filters */}
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonBlock key={i} className="h-9 w-24 rounded-lg" />
      ))}
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Charts Row 1 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton tall />
      <ChartSkeleton tall />
    </div>

    {/* Charts Row 2 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
));
LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
