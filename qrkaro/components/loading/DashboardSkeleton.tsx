import OrderCardSkeleton from './OrderCardSkeleton';

export default function DashboardSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-5 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
        <div className="h-11 w-11 bg-gray-200 rounded-2xl" />
      </div>

      <div className="h-36 bg-gray-200 rounded-2xl" />

      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 flex-1 bg-gray-200 rounded-xl" />
        ))}
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}