'use client';

import { useOnboardingStore } from '@/lib/store';
import ShopDetails from './steps/ShopDetails';
import MenuInput from './steps/MenuInput';
import PaymentDetails from './steps/PaymentDetails';
import Preview from './steps/Preview';
import SubscriptionPayment from './steps/SubscriptionPayment';

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore();

  const steps = [
    { id: 1, label: 'Shop Details' },
    { id: 2, label: 'Menu' },
    { id: 3, label: 'Payment Info' },
    { id: 4, label: 'Preview' },
    { id: 5, label: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-orange-500">Nosher</span>
          </h1>
          <p className="text-gray-600">Set up your digital shop in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                      currentStep >= step.id
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition ${
                      currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="transition-all duration-300">
          {currentStep === 1 && <ShopDetails />}
          {currentStep === 2 && <MenuInput />}
          {currentStep === 3 && <PaymentDetails />}
          {currentStep === 4 && <Preview />}
          {currentStep === 5 && <SubscriptionPayment />}
        </div>
      </div>
    </div>
  );
}
