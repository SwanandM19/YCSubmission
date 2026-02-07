import { create } from 'zustand';

interface MenuItem {
  name: string;
  price: number;
}

interface OnboardingState {
  currentStep: number;
  shopName: string;
  phone: string;
  city: string;
  shopType: string;
  menuItems: MenuItem[];
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  setCurrentStep: (step: number) => void;
  setShopDetails: (details: {
    shopName: string;
    phone: string;
    city: string;
    shopType: string;
  }) => void;
  setMenuItems: (items: MenuItem[]) => void;
  setPaymentDetails: (details: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    panNumber: string;
  }) => void;
  resetForm: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  shopName: '',
  phone: '',
  city: '',
  shopType: '',
  menuItems: [],
  accountHolderName: '',
  accountNumber: '',
  ifscCode: '',
  panNumber: '',
  setCurrentStep: (step) => set({ currentStep: step }),
  setShopDetails: (details) => set(details),
  setMenuItems: (items) => set({ menuItems: items }),
  setPaymentDetails: (details) => set(details),
  resetForm: () =>
    set({
      currentStep: 1,
      shopName: '',
      phone: '',
      city: '',
      shopType: '',
      menuItems: [],
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      panNumber: '',
    }),
}));
