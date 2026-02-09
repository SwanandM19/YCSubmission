import { Suspense } from 'react';

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500" />
            <p className="text-gray-600">Loading your success page...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}