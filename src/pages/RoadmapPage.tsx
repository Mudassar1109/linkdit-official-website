import React, { useState } from 'react';
import { PageId, RoadmapItem } from '../types';
import { ROADMAP_ITEMS, PRODUCT_NAME } from '../data/websiteData';
import { ThumbsUp, Plus, CheckCircle, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface RoadmapProps {
  navigate: (page: PageId) => void;
}

export const RoadmapPage: React.FC<RoadmapProps> = ({ navigate }) => {
  const [items, setItems] = useState<RoadmapItem[]>(ROADMAP_ITEMS);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleVote = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasVoted = votedIds[id];
          return {
            ...item,
            votes: hasVoted ? item.votes - 1 : item.votes + 1,
          };
        }
        return item;
      })
    );
    setVotedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: RoadmapItem = {
      id: `road-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'User proposed feature under review by engineering team.',
      category: 'Community Proposal',
      status: 'Under Review',
      targetRelease: 'Target: TBD',
      votes: 1,
      tags: ['Community', 'Proposal'],
    };
    setItems((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowProposeModal(false);
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      <section className="bg-slate-100 dark:bg-slate-900 py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Public Product Roadmap
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Future Development
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Vote on upcoming features, track active development milestones, and propose your ideas for future versions of {PRODUCT_NAME}.
          </p>

          <button
            onClick={() => setShowProposeModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Propose Feature Idea</span>
          </button>
        </div>
      </section>

      {/* ROADMAP ITEMS LIST */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    item.status === 'In Progress'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : item.status === 'Completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.targetRelease}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Vote Button */}
            <button
              onClick={() => handleVote(item.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                votedIds[item.id]
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{item.votes} Votes</span>
            </button>
          </div>
        ))}
      </section>

      {/* Propose Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePropose}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Propose a Feature Idea
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Feature Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Split dual window mode..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Explain why this feature would improve writing workflows..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProposeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Idea
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
