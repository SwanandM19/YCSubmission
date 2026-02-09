import { create } from 'zustand';

interface OnboardingState {
  currentStep: number;
  
  // Shop Details
  shopName: string;
  phone: string;
  city: string;
  state: string;
  shopType: string;
  
  // Menu Items
  menuItems: { name: string; price: number }[];
  
  // Payment Details
  upiId: string;
  accountHolderName: string;
  bankAccount: string;
  ifscCode: string;

  // Subscription Payment
  subscriptionPaid: boolean;
  subscriptionPaymentId: string;
  subscriptionOrderId: string;

  // Actions
  setCurrentStep: (step: number) => void;
  setShopDetails: (details: any) => void;
  setMenuItems: (items: any[]) => void;
  setPaymentDetails: (details: any) => void;
  setSubscriptionPayment: (data: any) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  shopName: '',
  phone: '',
  city: '',
  state: '',
  shopType: '',
  menuItems: [],
  upiId: '',
  accountHolderName: '',
  bankAccount: '',
  ifscCode: '',
  subscriptionPaid: false,
  subscriptionPaymentId: '',
  subscriptionOrderId: '',

  setCurrentStep: (step) => set({ currentStep: step }),
  
  setShopDetails: (details) => set({
    shopName: details.shopName,
    phone: details.phone,
    city: details.city,
    state: details.state,
    shopType: details.shopType,
  }),
  
  setMenuItems: (items) => set({ menuItems: items }),
  
  setPaymentDetails: (details) => set({
    upiId: details.upiId,
    accountHolderName: details.accountHolderName,
    bankAccount: details.bankAccount,
    ifscCode: details.ifscCode,
  }),

  setSubscriptionPayment: (data) => set({
    subscriptionPaid: data.subscriptionPaid,
    subscriptionPaymentId: data.subscriptionPaymentId,
    subscriptionOrderId: data.subscriptionOrderId,
  }),
  
  reset: () => set({
    currentStep: 1,
    shopName: '',
    phone: '',
    city: '',
    state: '',
    shopType: '',
    menuItems: [],
    upiId: '',
    accountHolderName: '',
    bankAccount: '',
    ifscCode: '',
    subscriptionPaid: false,
    subscriptionPaymentId: '',
    subscriptionOrderId: '',
  }),
}));
