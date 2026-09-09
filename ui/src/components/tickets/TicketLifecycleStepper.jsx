import React from 'react';
import { Check, RotateCcw } from 'lucide-react';

const LIFECYCLE_STEPS = [
  { key: 'created', label: '1. Created' },
  { key: 'in_progress', label: '2. In Progress' },
  { key: 'done', label: '3. Done (Review)' },
  { key: 'resolved', label: '4. Resolved' }
];

export default function TicketLifecycleStepper({ status }) {
  const isReopened = status === 'reopened';
  const stepOrder = ['created', 'in_progress', 'done', 'resolved'];
  const normalizedStatus = status === 'assigned' ? 'in_progress' : status;
  const currentIndex = isReopened ? 0 : stepOrder.indexOf(normalizedStatus);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Workflow Stage
        </span>
        {isReopened && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg">
            <RotateCcw className="w-3 h-3" /> Reopened
          </span>
        )}
      </div>

      <div className="relative flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700" />
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300"
          style={{
            width: isReopened 
              ? '10%' 
              : `${Math.max(0, (currentIndex / (LIFECYCLE_STEPS.length - 1)) * 100)}%`
          }}
        />

        {LIFECYCLE_STEPS.map((step, idx) => {
          const isPassed = !isReopened && idx < currentIndex;
          const isCurrent = !isReopened && idx === currentIndex;

          let circleClass = 'bg-slate-200 dark:bg-slate-700 text-slate-400';
          let textClass = 'text-slate-400 dark:text-slate-500 font-bold';

          if (isPassed) {
            circleClass = 'bg-blue-600 text-white';
            textClass = 'text-slate-800 dark:text-slate-200 font-bold';
          } else if (isCurrent) {
            circleClass = 'bg-blue-600 text-white font-extrabold shadow-md';
            textClass = 'text-blue-600 dark:text-blue-400 font-extrabold';
          } else if (isReopened && idx === 0) {
            circleClass = 'bg-rose-600 text-white font-extrabold';
            textClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
          }

          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${circleClass}`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span className={`text-[11px] whitespace-nowrap hidden sm:block ${textClass}`}>
                {step.label.replace(/^\d+\.\s*/, '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
