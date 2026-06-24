'use client';

interface RetryStateProps {
  title: string;
  subtitle: string;
  onRetry: () => void;
  buttonText?: string;
}

export default function RetryState({
  title,
  subtitle,
  onRetry,
  buttonText = 'Try Again',
}: RetryStateProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mb-6">
        <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{subtitle}</p>

      <button
        onClick={onRetry}
        className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition"
      >
        {buttonText}
      </button>
    </div>
  );
}