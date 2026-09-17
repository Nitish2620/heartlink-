import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Filter } from 'lucide-react';

export type RelationshipIntent = 'all' | 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun';

export interface IntentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIntent: RelationshipIntent;
  onSelectIntent: (intent: RelationshipIntent) => void;
}

export const IntentFilterModal: React.FC<IntentFilterModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedIntent,
  onSelectIntent,
}) => {
  const options: { id: RelationshipIntent; label: string }[] = [
    { id: 'all', label: '✨ All Intents' },
    { id: 'Long-term relationship', label: '💖 Long-term Relationship' },
    { id: 'Deep connection', label: '🌿 Deep Intentional Connection' },
    { id: 'Spontaneous fun', label: '⚡ Spontaneous Fun & Adventures' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xs p-5 rounded-2xl border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-purple-600" />
            <span>HeartLink Intent Filters</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Filter profiles by relationship intent & values.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-2">
          <label className="text-xs font-bold text-slate-700">Relationship Intent</label>
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectIntent(opt.id);
                onClose();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition cursor-pointer border ${
                selectedIntent === opt.id
                  ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

IntentFilterModal.displayName = 'IntentFilterModal';
