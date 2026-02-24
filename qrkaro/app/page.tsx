// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
//       {/* Header */}
//       <header className="border-b bg-white/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">Q</span>
//             </div>
//             <span className="text-2xl font-bold text-gray-900">QRKaro</span>
//           </div>
//           <Link
//             href="/onboard"
//             className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
//           >
//             Get Started
//           </Link>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 py-20 text-center">
//         <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//           Your Shop, Now Digital
//           <br />
//           <span className="text-orange-500">In Just 5 Minutes</span>
//         </h1>
//         <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
//           Help small local businesses set up digital ordering and payments instantly.
//           No complex setup, no commission per order.
//         </p>
//         <Link
//           href="/onboard"
//           className="inline-block px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-xl hover:bg-orange-600 transition transform hover:scale-105 shadow-lg"
//         >
//           Start Free Setup →
//         </Link>
//       </div>

//       {/* Features */}
//       <div className="max-w-7xl mx-auto px-4 py-20">
//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="bg-white p-8 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Setup</h3>
//             <p className="text-gray-600">Upload your menu, get your QR code in minutes. No technical knowledge required.</p>
//           </div>

//           <div className="bg-white p-8 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Payments</h3>
//             <p className="text-gray-600">Money goes directly to your bank account. No per-order commissions.</p>
//           </div>

//           <div className="bg-white p-8 rounded-xl shadow-sm">
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Simple Dashboard</h3>
//             <p className="text-gray-600">Manage orders, update menu, and track earnings from one simple dashboard.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Upload,
  QrCode,
  CreditCard,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface StepItem {
  step: string;
  desc: string;
  icon: React.ReactNode;
  bg: string;
}

interface UseCase {
  name: string;
  img: string;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export default function LandingPage() {
  const [showQR, setShowQR] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const steps: StepItem[] = [
    {
      step: "1. Upload Menu",
      desc: "Simply take a photo of your menu or upload a PDF. We'll digitize it for you instantly.",
      icon: <Upload className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      step: "2. Get QR + Admin App",
      desc: "Print your custom QR and download the vendor app to manage incoming orders in real-time.",
      icon: <QrCode className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      step: "3. Customers Scan & Pay",
      desc: "Direct-to-vendor payments via UPI, Cards, or Cash. No hidden platform commissions.",
      icon: <CreditCard className="w-8 h-8 text-orange-500" />,
      bg: "bg-orange-50",
    },
  ];

  const useCases: UseCase[] = [
    {
      name: "Food Stalls",
      img: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Canteens",
      img: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=300",
    },
    {
      name: "Cafes",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300",
    },
    { name: "Xerox Shops", img: "/xerox.png" },
    {
      name: "Event Counters",
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=300",
    },
  ];

  const features: FeatureItem[] = [
    {
      title: "0% Commission",
      desc: "Keep 100% of what you earn. We don't take a cut from your sales.",
      icon: <Zap className="text-orange-600 w-6 h-6" />,
    },
    {
      title: "No Waiting Lines",
      desc: "Customers order while standing or sitting. Reduce congestion at the counter.",
      icon: <Clock className="text-orange-600 w-6 h-6" />,
    },
    {
      title: "Secure Payments",
      desc: "Directly integrated with UPI and Razorpay for industry-grade security.",
      icon: <ShieldCheck className="text-orange-600 w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <QrCode className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                <span className="text-orange-500">No</span>sher
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#use-cases"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                Use Cases
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                Contact
              </a>

              <Link
                href="/vendor/login"
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                Vendor Login
              </Link>

              <Link
                href="/onboard"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
            <a
              href="#how-it-works"
              className="block text-base font-medium text-gray-600"
            >
              How it Works
            </a>
            <a
              href="#use-cases"
              className="block text-base font-medium text-gray-600"
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="block text-base font-medium text-gray-600"
            >
              Pricing
            </a>
            <Link
              href="/vendor/login"
              className="block text-base font-medium text-gray-600"
            >
              Vendor Login
            </Link>
            <Link
              href="/onboard"
              className="block w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase mb-6">
              India's Smartest QR Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-gray-900 mb-6">
              Scan Karo. <br />
              <span className="text-orange-500">Order Karo.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
              Instant QR ordering for food stalls, canteens & xerox shops. No
              commission, no waiting lines. Empowering local businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboard"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-orange-200 hover:-translate-y-1 text-center"
              >
                Get Started as Vendor
              </Link>

              <a
                href="#demo"
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-gray-200 text-center"
              >
                View Demo QR
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-orange-100 rounded-[40px] rotate-3 opacity-50"></div>
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
                alt="Scanning QR code at a counter"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                <div className="flex items-center gap-3 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Live Updates
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Order #204 Received
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              How It Works
            </h2>
            <p className="text-gray-500 font-medium">
              Set up your digital shop in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center"
              >
                <div className={`${item.bg} p-5 rounded-3xl mb-8`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.step}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Every Business */}
      <section
        id="use-cases"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-black mb-12">Built for Every Business</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {useCases.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-square rounded-3xl overflow-hidden mb-4 bg-gray-100 shadow-sm transition-transform group-hover:scale-95">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center font-bold text-gray-700">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="demo" className="py-24 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[48px] p-8 md:p-20 shadow-xl shadow-orange-100 border border-orange-100 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-10">Why Choose Nosher?</h2>
              <ul className="space-y-8">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xl mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-500">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 rounded-[40px] p-10 flex flex-col items-center">
              <div className="bg-white p-8 rounded-3xl shadow-xl mb-8 transform -rotate-2">
                {/* <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
                  <img
                    src="/demo-qr.png"
                    alt="Demo QR"
                    className="w-40 h-40 object-contain"
                  />
                </div> */}
                <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>

              </div>
              {/* <Link
                href="/v/demo"
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition text-center"
              >
                Scan Demo QR
              </Link> */}
              <button
                onClick={() => setShowQR(true)}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition text-center"
              >
                Scan Demo QR
              </button>

              <p className="mt-6 text-sm text-gray-400 font-medium italic text-center">
                Experience the customer-side flow instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            Simple Pricing for Every Business
          </h2>
          <p className="text-gray-500 font-medium">
            Choose the plan that fits your growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white border-2 border-gray-100 p-10 rounded-[40px] hover:border-orange-200 transition-all flex flex-col">
            <h3 className="text-xl font-bold mb-4">Starter Plan</h3>
            <div className="mb-6">
              <span className="text-4xl font-black">₹199</span>
              <span className="text-gray-400 ml-1">/ month</span>
            </div>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-8 line-through">
              Setup Fee: ₹500
            </p>

            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Includes QR + Admin App</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Instant Setup</span>
              </li>
            </ul>

            <Link
              href="/onboard"
              className="w-full py-4 border-2 border-orange-500 text-orange-500 font-bold rounded-2xl hover:bg-orange-50 transition-colors text-center"
            >
              Start Free Setup
            </Link>
          </div>

          {/* Business Plan */}
          <div className="bg-white border-2 border-orange-500 p-10 rounded-[40px] shadow-2xl shadow-orange-100 relative flex flex-col">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-4">Business Plan</h3>
            <div className="mb-6">
              <span className="text-4xl font-black">₹399</span>
              <span className="text-gray-400 ml-1">/ month</span>
            </div>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-8 line-through">
              Setup Fee: ₹999
            </p>

            <ul className="space-y-4 mb-12 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Everything in Starter</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Multiple Menus</span>
              </li>
            </ul>

            <Link
              href="/onboard"
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-colors text-center"
            >
              Start Free Setup
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-500 p-1 rounded-md">
                  <QrCode className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-black tracking-tight">
                  Nosher
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Digitalising India's small businesses, one scan at a time.
                Empowering vendors with zero-commission tools.
              </p>
            </div>

            {/* Product */}
            <div>
              <h5 className="font-bold mb-6 text-gray-900">Product</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-orange-500 transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    href="/vendor/login"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Merchant Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="font-bold mb-6 text-gray-900">Company</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="font-bold mb-6 text-gray-900">Legal</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-200 flex justify-center">
            <p className="text-sm text-gray-400 font-medium">
              © 2026 Nosher. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {showQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-4">Scan Demo QR</h3>

            <img
              src="/demo-qr.png"
              alt="Demo QR"
              className="w-64 h-64 mx-auto mb-6"
            />

            <p className="text-gray-500 text-sm mb-6">
              Scan this QR on your phone to open the live demo menu.
            </p>

            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
