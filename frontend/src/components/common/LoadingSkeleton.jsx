export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'page') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-dark-400 text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 skeleton rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton w-1/3" />
                <div className="h-3 skeleton w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 skeleton w-full" />
              <div className="h-3 skeleton w-4/5" />
              <div className="h-3 skeleton w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 skeleton rounded-lg" />
            <div className="flex-1 h-4 skeleton" />
            <div className="w-20 h-4 skeleton" />
            <div className="w-16 h-4 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-card p-6">
        <div className="h-4 skeleton w-1/4 mb-4" />
        <div className="h-64 skeleton rounded-xl" />
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 skeleton w-12 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
