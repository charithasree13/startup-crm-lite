/**
 * TopPerformersCard Component
 * Ranks sales reps by won revenue with rank badges and progress bars.
 */

import { memo } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { formatINR } from '../../utils/analyticsHelpers';

/** Rank badge with medal colors */
const RankBadge = memo(({ rank }) => {
  const styles = {
    1: 'bg-amber-400 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-amber-600 text-white',
  };
  return (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
        styles[rank] || 'bg-slate-200 text-slate-600 dark:text-slate-300'
      }`}
    >
      {rank}
    </span>
  );
});
RankBadge.displayName = 'RankBadge';

/** Avatar initials */
const Avatar = memo(({ name, rank }) => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
  ];
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
        colors[(rank - 1) % colors.length]
      }`}
    >
      {initials}
    </div>
  );
});
Avatar.displayName = 'Avatar';

const TopPerformersCard = memo(({ topPerformers = [] }) => {
  const maxRevenue = topPerformers.length > 0 ? topPerformers[0]?.wonRevenue || 1 : 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Performers</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Ranked by won revenue</p>
        </div>
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {topPerformers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-10 text-slate-400 dark:text-slate-500 text-sm">
          No won deals yet
        </div>
      ) : (
        <div className="space-y-4">
          {topPerformers.map((rep) => {
            const barWidth = maxRevenue > 0
              ? Math.max(8, (rep.wonRevenue / maxRevenue) * 100)
              : 8;

            return (
              <div key={rep.owner} className="group">
                {/* Rep row */}
                <div className="flex items-center gap-3 mb-1.5">
                  <RankBadge rank={rep.rank} />
                  <Avatar name={rep.owner} rank={rep.rank} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{rep.owner}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {rep.wonCount} deal{rep.wonCount !== 1 ? 's' : ''} closed
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{formatINR(rep.wonRevenue)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{rep.totalLeads} leads</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="ml-9 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor:
                        rep.rank === 1
                          ? '#F59E0B'
                          : rep.rank === 2
                          ? '#94A3B8'
                          : rep.rank === 3
                          ? '#92400E'
                          : '#2563EB',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {topPerformers.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {topPerformers.length} rep{topPerformers.length !== 1 ? 's' : ''} tracked
          </span>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Medal className="w-3.5 h-3.5" />
            {topPerformers[0]?.owner || '—'} leads
          </span>
        </div>
      )}
    </div>
  );
});

TopPerformersCard.displayName = 'TopPerformersCard';
export default TopPerformersCard;
