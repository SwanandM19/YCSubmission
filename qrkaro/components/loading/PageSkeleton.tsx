export default function PageSkeleton() {
  return (
    <div className="animate-pulse p-4 lg:p-6 space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded-xl" />
      <div className="h-24 w-full bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}