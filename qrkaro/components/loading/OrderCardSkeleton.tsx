export default function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-28 bg-gray-200 rounded" />
        </div>
        <div className="h-7 w-16 bg-gray-200 rounded-full" />
      </div>

      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}