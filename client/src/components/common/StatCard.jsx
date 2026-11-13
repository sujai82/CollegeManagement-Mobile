import React from 'react';
import useInView from '../../hooks/useInView';

export const StatCard = ({
  title,
  value,
  icon,
  subtext,
  trend,
  progress,
  progressColor = 'bg-[var(--primary)]',
  badge,
  badgeType = 'sky',
  index = 0,
}) => {
  const [cardRef, isInView] = useInView({ threshold: 0.1 });

  const getBadgeClass = (type) => {
    switch (type) {
      case 'purple':
        return 'badge-purple';
      case 'emerald':
        return 'badge-emerald';
      case 'rose':
        return 'badge-rose';
      case 'amber':
        return 'badge-amber';
      case 'sky':
      default:
        return 'badge-sky';
    }
  };

  return (
    <div
      ref={cardRef}
      style={{ '--i': index }}
      className={`card-stitch p-4 sm:p-5 flex flex-col justify-between bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden shadow-xs ${
        isInView ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--secondary-text)]">
          {title}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-[var(--primary)] text-[22px]">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-2.5">
        <span className="text-2xl sm:text-3xl font-bold text-[var(--main-text)] tracking-tight">
          {value ?? '—'}
        </span>
        {badge && (
          <span className={getBadgeClass(badgeType)}>
            {badge}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--secondary-text)]">
          {subtext ? <span>{subtext}</span> : <span />}
          {trend && (
            <span className="text-xs font-medium text-[var(--secondary-text)]">
              {trend}
            </span>
          )}
        </div>
      )}

      {progress !== undefined && (
        <div className="w-full bg-[#EDE9FE] h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full origin-left transition-all duration-500 ${progressColor} ${
              isInView ? 'animate-scale-x' : 'scale-x-0'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
