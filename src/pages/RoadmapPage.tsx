import React, { useState } from 'react';
import { PageId, RoadmapItem } from '../types';
import { ROADMAP_ITEMS, PRODUCT_NAME } from '../data/websiteData';
import { ThumbsUp, Plus, Clock } from 'lucide-react';

interface RoadmapProps {
  navigate: (page: PageId) => void;
}

const statusStyles: Record<RoadmapItem['status'], string> = {
  Planned: 'bg-ink dark:text-paper dark:bg-paper dark:text-ink',
  'In Progress': 'bg-accent text-blue-50',
  'Under Review': 'bg-accent-soft text-accent-deep dark:bg-accent/15 dark:text-blue-300',
  Completed: 'bg-ink-soft/20 text-ink-soft dark:bg-paper/10 dark:text-paper/70',
};

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
          return { ...item, votes: hasVoted ? item.votes - 1 : item.votes + 1 };
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
      description: newDesc || 'User proposal — under review.',
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
    <div className="border-t border-line dark:border-line-dark">
      {/* Header */}
      <header className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 text-center space-y-5">
          <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-ink-mute dark:text-paper/55">
            Roadmap
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink dark:text-paper">
            What happens next
          </h1>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-ink-soft dark:text-paper/65 leading-relaxed">
            A short list of the improvements we are planning for {PRODUCT_NAME}. We publish this so
            expectations are clear — and so you can tell us what to build first.
          </p>
          <button
            onClick={() => setShowProposeModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-ink/90 transition-colors dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
          >
            <Plus className="w-4 h-4" />
            Propose a feature
          </button>
        </div>
      </header>

      {/* Items */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 && (
          <p className="text-center text-sm text-ink-mute dark:text-paper/45 py-10">
            Nothing here yet — check back soon.
          </p>
        )}
        <div className="space-y-px bg-line dark:bg-line-dark border border-line dark:border-line-dark">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-surface dark:bg-ink-850 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-2 dark:bg-ink-850 text-ink-soft dark:text-paper/60">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-ink dark:text-paper">{item.title}</h3>
                <p className="text-sm text-ink-soft dark:text-paper/60 leading-relaxed">{item.description}</p>
                <p className="flex items-center gap-1.5 text-xs font-mono text-ink-mute dark:text-paper/40">
                  <Clock className="w-3.5 h-3.5" />
                  {item.targetRelease}
                </p>
              </div>

              <button
                onClick={() => handleVote(item.id)}
                aria-pressed={!!votedIds[item.id]}
                className={`shrink-0 inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold border transition-colors ${
                  votedIds[item.id]
                    ? 'bg-accent text-blue-50 border-accent'
                    : 'border-line-strong dark:border-line-dark text-ink-soft dark:text-paper/65 hover:border-accent'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {item.votes}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-mute dark:text-paper/40 pt-8">
          Votes and proposals live only on this page — they are not connected to the app.
        </p>
      </section>

      {/* Propose modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePropose}
            className="w-full max-w-md bg-surface dark:bg-ink-850 border border-line dark:border-line-dark p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-ink dark:text-paper">Propose a feature</h3>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-soft dark:text-paper/60">Feature title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Split-pane mode"
                required
                className="w-full px-3 py-2 rounded-md bg-paper-2 dark:bg-ink-850 border border-line dark:border-line-dark text-sm text-ink dark:text-paper focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-ink-soft dark:text-paper/60">Why it would help</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="A sentence or two about the writing workflow it supports..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-paper-2 dark:bg-ink-850 border border-line dark:border-line-dark text-sm text-ink dark:text-paper focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProposeModal(false)}
                className="px-4 py-2 rounded-md text-xs font-semibold text-ink-soft dark:text-paper/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-xs font-semibold bg-ink text-paper hover:bg-ink/90 dark:bg-paper dark:text-ink dark:hover:bg-paper/90"
              >
                Submit proposal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};