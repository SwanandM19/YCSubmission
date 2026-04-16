// import { create } from 'zustand';

// interface OnboardingState {
//   currentStep: number;
  
//   // Shop Details
//   shopName: string;
//   phone: string;
//   city: string;
//   state: string;
//   shopType: string;
  
//   // Menu Items
//   // menuItems: { name: string; price: number }[];
//   // ✅ New:
// menuItems: {
//   name: string;
//   price: number;
//   category?: string;
//   stock?: number | null;
//   unit?: string;
//   sku?: string;
//   lowStockThreshold?: number;
//   isVeg?: boolean;
//   desc?: string;
// }[];
  
//   // Payment Details
//   upiId: string;
//   accountHolderName: string;
//   bankAccount: string;
//   ifscCode: string;

//   // Subscription Payment
//   subscriptionPaid: boolean;
//   subscriptionPaymentId: string;
//   subscriptionOrderId: string;

//   // Actions
//   setCurrentStep: (step: number) => void;
//   setShopDetails: (details: any) => void;
//   setMenuItems: (items: any[]) => void;
//   setPaymentDetails: (details: any) => void;
//   setSubscriptionPayment: (data: any) => void;
//   reset: () => void;
// }

// export const useOnboardingStore = create<OnboardingState>((set) => ({
//   currentStep: 1,
//   shopName: '',
//   phone: '',
//   city: '',
//   state: '',
//   shopType: '',
//   menuItems: [],
//   upiId: '',
//   accountHolderName: '',
//   bankAccount: '',
//   ifscCode: '',
//   subscriptionPaid: false,
//   subscriptionPaymentId: '',
//   subscriptionOrderId: '',

//   setCurrentStep: (step) => set({ currentStep: step }),
  
//   setShopDetails: (details) => set({
//     shopName: details.shopName,
//     phone: details.phone,
//     city: details.city,
//     state: details.state,
//     shopType: details.shopType,
//   }),
  
//   setMenuItems: (items) => set({ menuItems: items }),
  
//   setPaymentDetails: (details) => set({
//     upiId: details.upiId,
//     accountHolderName: details.accountHolderName,
//     bankAccount: details.bankAccount,
//     ifscCode: details.ifscCode,
//   }),

//   setSubscriptionPayment: (data) => set({
//     subscriptionPaid: data.subscriptionPaid,
//     subscriptionPaymentId: data.subscriptionPaymentId,
//     subscriptionOrderId: data.subscriptionOrderId,
//   }),
  
//   reset: () => set({
//     currentStep: 1,
//     shopName: '',
//     phone: '',
//     city: '',
//     state: '',
//     shopType: '',
//     menuItems: [],
//     upiId: '',
//     accountHolderName: '',
//     bankAccount: '',
//     ifscCode: '',
//     subscriptionPaid: false,
//     subscriptionPaymentId: '',
//     subscriptionOrderId: '',
//   }),
// }));

import { create } from 'zustand';

interface OnboardingState {
  currentStep: number;

  // Shop Details
  shopName: string;
  phone: string;
  city: string;
  state: string;
  shopType: string;

  // Menu Items — ✅ extended for grocery
  menuItems: {
    name: string;
    price: number;
    category?: string;
    stock?: number | null;
    unit?: string;
    sku?: string;
    lowStockThreshold?: number;
    isVeg?: boolean;
    desc?: string;
  }[];

  // ✅ Grocery Excel upload
  excelFile: File | null;

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
  setExcelFile: (file: File | null) => void; // ✅ ADDED
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
  excelFile: null, // ✅ ADDED
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

  setExcelFile: (file) => set({ excelFile: file }), // ✅ ADDED

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
    excelFile: null, // ✅ ADDED
    upiId: '',
    accountHolderName: '',
    bankAccount: '',
    ifscCode: '',
    subscriptionPaid: false,
    subscriptionPaymentId: '',
    subscriptionOrderId: '',
  }),
}));