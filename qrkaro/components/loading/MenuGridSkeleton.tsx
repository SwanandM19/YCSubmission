// export default function MenuGridSkeleton() {
//   return (
//     <div className="p-4 space-y-4 animate-pulse">
//       <div className="h-12 bg-gray-200 rounded-2xl" />
//       <div className="grid grid-cols-2 gap-4">
//         {[1, 2, 3, 4, 5, 6].map((i) => (
//           <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 space-y-3">
//             <div className="h-28 bg-gray-200 rounded-xl" />
//             <div className="h-4 bg-gray-200 rounded w-3/4" />
//             <div className="h-3 bg-gray-200 rounded w-1/2" />
//             <div className="h-9 bg-gray-200 rounded-xl" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function MenuGridSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Header shimmer */}
      <div className="space-y-2 mb-4">
        <div className="h-7 bg-gray-200 rounded-xl w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Search bar shimmer */}
      <div className="h-12 bg-gray-200 rounded-2xl" />

      {/* Grid shimmer */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 space-y-3">
            <div className="h-28 bg-gray-200 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-9 bg-gray-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}