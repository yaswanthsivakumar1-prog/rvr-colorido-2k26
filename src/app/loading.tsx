import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
        </div>
      </div>
      <p className="text-text-secondary text-sm font-medium animate-pulse tracking-wide">
        Loading COLORIDO 2K26...
      </p>
    </div>
  );
}
