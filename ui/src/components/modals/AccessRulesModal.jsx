import React from 'react';
import { X, Check } from 'lucide-react';

const RULES = [
  { action: 'View all tickets', admin: true, creator: false, assigned: false, other: false },
  { action: 'View own created tickets', admin: true, creator: true, assigned: false, other: false },
  { action: 'View assigned tickets', admin: true, creator: false, assigned: true, other: false },
  { action: 'Create ticket', admin: 'optional', creator: true, assigned: true, other: true },
  { action: 'Assign ticket', admin: true, creator: false, assigned: false, other: false },
  { action: 'Change to in_progress', admin: true, creator: false, assigned: true, other: false },
  { action: 'Mark completed', admin: true, creator: false, assigned: true, other: false },
  { action: 'Resolve ticket', admin: true, creator: false, assigned: false, other: false },
  { action: 'Reopen ticket', admin: true, creator: true, assigned: false, other: false },
  { action: 'View ticket logs', admin: true, creator: 'own', assigned: 'assigned', other: false },
];

export default function AccessRulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const renderBadge = (val) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-500 font-bold">
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
        {val}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Access Rules & Permissions
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Role permissions matrix
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4 text-center">Admin</th>
                  <th className="py-3.5 px-4 text-center">Creator</th>
                  <th className="py-3.5 px-4 text-center">Assignee</th>
                  <th className="py-3.5 px-4 text-center">Other User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-bold">
                {RULES.map((rule) => (
                  <tr key={rule.action} className="hover:bg-slate-100/50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {rule.action}
                    </td>
                    <td className="py-3 px-4 text-center">{renderBadge(rule.admin)}</td>
                    <td className="py-3 px-4 text-center">{renderBadge(rule.creator)}</td>
                    <td className="py-3 px-4 text-center">{renderBadge(rule.assigned)}</td>
                    <td className="py-3 px-4 text-center">{renderBadge(rule.other)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
