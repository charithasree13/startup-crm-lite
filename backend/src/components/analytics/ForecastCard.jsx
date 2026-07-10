/**
 * ForecastCard Component
 * Revenue forecast for next month using 6-month rolling average.
 * Shows predicted revenue, confidence score, and growth trend.
 */

import { memo } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatINR } from '../../utils/analyticsHelpers';

const ForecastCard = memo(({ forecastData = {} }) => {
  const { forecast = 0, confidence = 0, trend = 0 } = forecastData;

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor =
    trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-slate-400 dark:text-slate-500';
  const trendBg =
    trend > 0 ? 'bg-emerald-50 border-emerald-100' : trend < 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700';

  // Confidence color
  const confidenceColor =
    confidence >= 70 ? '#22C55E' : confidence >= 40 ? '#F59E0B' : '#EF4444';
  const confidenceLabel =
    confidence >= 70 ? 'High' : confidence >= 40 ? 'Medium' : 'Low';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Forecast</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Predicted next month based on 6-mo avg</p>
        </div>
        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-500" />
        </div>
      </div>

      {/* Main forecast value */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-5 mb-4 border border-violet-100">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">
          Predicted Revenue · Next Month
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatINR(forecast)}
        </p>
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mt-3 ${trendBg} ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trend > 0 ? '+' : ''}{trend}% vs recent avg
        </div>
      </div>

      {/* Confidence score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500">Forecast Confidence</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: confidenceColor, backgroundColor: `${confidenceColor}18` }}
          >
            {confidenceLabel} ({confidence}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${confidence}%`, backgroundColor: confidenceColor }}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
        Forecast is calculated using a weighted average of the last 6 months of won revenue with a 5% growth factor applied.
      </p>
    </div>
  );
});

ForecastCard.displayName = 'ForecastCard';
export default ForecastCard;
