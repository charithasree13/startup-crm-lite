/**
 * FunnelChartCard Component
 * Visualizes the sales funnel with a geometric SVG funnel shape and a side legend.
 */

import { memo } from 'react';
import { ArrowDown } from 'lucide-react';
import { FUNNEL_COLORS } from '../../constants/analyticsColors';

const FunnelChartCard = memo(({ funnelData = [] }) => {
  if (!funnelData || funnelData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Funnel</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Pipeline stage conversion</p>
        </div>
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No funnel data available
        </div>
      </div>
    );
  }

  const totalStages = funnelData.length;
  const svgHeight = 300;
  const svgWidth = 400;

  // Helper to calculate the SVG path for each curvy funnel segment
  const getStagePath = (index) => {
    const stageHeight = svgHeight / totalStages;
    const topY = index * stageHeight;
    const bottomY = (index + 1) * stageHeight;

    // Calculate X coordinates based on a V-shape where bottom center is (200, 300)
    const topLeftX = (topY / svgHeight) * (svgWidth / 2);
    const topRightX = svgWidth - topLeftX;
    const bottomLeftX = (bottomY / svgHeight) * (svgWidth / 2);
    const bottomRightX = svgWidth - bottomLeftX;

    const curveDepth = 15; // How much the dividing lines curve downwards

    let d = `M ${topLeftX},${topY} `;
    
    // Top edge
    if (index === 0) {
      d += `L ${topRightX},${topY} `; // Flat top for the first stage
    } else {
      d += `Q ${svgWidth / 2},${topY + curveDepth} ${topRightX},${topY} `; // Curved top
    }

    // Right edge
    d += `L ${bottomRightX},${bottomY} `;

    // Bottom edge
    if (index < totalStages - 1) {
      d += `Q ${svgWidth / 2},${bottomY + curveDepth} ${bottomLeftX},${bottomY} `; // Curved bottom
    }

    // Left edge (closes the path)
    d += `Z`;

    return d;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Funnel</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Pipeline stage conversion</p>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row items-center gap-12 mt-2">
        
        {/* Left: SVG Geometric Funnel */}
        <div className="w-full md:w-3/5">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto drop-shadow-sm overflow-visible">
            {funnelData.map((item, i) => (
              <g key={item.stage} className="transition-all duration-300 hover:opacity-90">
                <path
                  d={getStagePath(i)}
                  fill={FUNNEL_COLORS[i] || '#94A3B8'}
                  stroke="white"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <text
                  x={svgWidth / 2}
                  y={(i + 0.5) * (svgHeight / totalStages) + (i === totalStages - 1 ? 0 : 7)} // Shift text down slightly to center in the curve, except for the bottom point
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="text-2xl font-bold font-sans pointer-events-none"
                >
                  {item.count}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Right: Legend & Metrics */}
        <div className="w-full md:w-2/5 flex flex-col gap-5">
          {funnelData.map((item, i) => (
            <div key={item.stage} className="flex items-start gap-3">
              {/* Legend Color Dot */}
              <div 
                className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" 
                style={{ backgroundColor: FUNNEL_COLORS[i] || '#94A3B8' }} 
              />
              
              {/* Legend Text Content */}
              <div>
                <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{item.stage}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                  
                  {/* Drop-off is shown for the stage it dropped *into* (i.e. using previous stage's dropOff metric) */}
                  {i > 0 && funnelData[i - 1].dropOff > 0 && (
                    <span className="text-[11px] font-medium text-red-400 flex items-center gap-0.5">
                      <ArrowDown className="w-3 h-3" />
                      {funnelData[i - 1].dropOff}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FunnelChartCard.displayName = 'FunnelChartCard';
export default FunnelChartCard;
