'use client';

import { useOnboardingStore } from '@/lib/store';
import ShopDetails from './steps/ShopDetails';
import MenuInput from './steps/MenuInput';
import PaymentDetails from './steps/PaymentDetails';
import Preview from './steps/Preview';

export default function OnboardingPage() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  const steps = [
    { number: 1, title: 'Shop Details' },
    { number: 2, title: 'Menu Items' },
    { number: 3, title: 'Payment Details' },
    { number: 4, title: 'Preview' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor Onboarding</h1>
          <p className="text-gray-600">Follow the steps to set up your digital storefront</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentStep >= step.number
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                  <p
                    className={`text-sm mt-2 font-medium ${
                      currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition ${
                      currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-sm text-gray-600">
            Step {currentStep} of {steps.length} • {Math.round((currentStep / steps.length) * 100)}% Completed
          </div>
        </div>

        {/* Step Content */}
        <div>
          {currentStep === 1 && <ShopDetails />}
          {currentStep === 2 && <MenuInput />}
          {currentStep === 3 && <PaymentDetails />}
          {currentStep === 4 && <Preview />}
        </div>
      </div>
    </div>
  );
}
