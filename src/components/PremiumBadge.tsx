import React from 'react';
import { Sparkles } from 'lucide-react';

export const PremiumBadge = () => {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-[10px] font-black text-amber-900 shadow-sm border border-amber-300 animate-pulse">
      <Sparkles className="h-2.5 w-2.5" />
      PREMIUM
    </div>
  );
};