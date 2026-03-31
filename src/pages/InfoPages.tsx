import { motion } from "framer-motion";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="px-6 md:px-20 py-12 min-h-[80vh] max-w-4xl mx-auto">
    <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest font-mono text-xs">
      <ArrowLeft className="w-4 h-4" />
      Back to Home
    </Link>

    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-7xl mb-16"
    >
      {title}
    </motion.h1>

    <div className="glass p-8 md:p-12 rounded-[2rem] space-y-8 text-white/70 leading-relaxed font-sans">
      {children}
    </div>
  </div>
);

export const About = () => (
  <PageLayout title="About Us">
    <p>WheelsGlow was born out of a simple idea: automotive art shouldn't disappear when the sun goes down.</p>
    <p>We combine high-resolution prints with carefully mapped LED technology to bring depth, emotion, and life to the iconic silhouettes of performance vehicles.</p>
    <p>Hand-assembled with care, each poster is designed to be the centerpiece of any garage, living space, or office.</p>
  </PageLayout>
);

export const CustomOrders = () => (
  <PageLayout title="Custom Orders">
    <p>Have a specific car or motorcycle you want transformed into a WheelsGlow masterpiece?</p>
    <p>We offer bespoke commissions. You provide the high-resolution image of your vehicle, and our design team will map the LED backlighting specifically for its contours.</p>
    <p>Contact us at <strong>commissions@wheelsglow.com</strong> with your request for a quote.</p>
  </PageLayout>
);

export const ShippingPolicy = () => (
  <PageLayout title="Shipping Policy">
    <p>We ship globally to over 50 countries. Every WheelsGlow poster is carefully packaged in heavy-duty tubes with the LED components secured in drop-resistant boxing.</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Domestic (India): 3-5 business days</li>
      <li>International: 7-14 business days</li>
    </ul>
    <p>You will receive a tracking link via email the moment your poster leaves our facility.</p>
  </PageLayout>
);

export const Returns = () => (
  <PageLayout title="Returns & Refunds">
    <p>We stand behind the quality of our LED art. If your poster arrives damaged or the lighting malfunctions, we offer a 30-day no-questions-asked replacement policy.</p>
    <p>For standard returns (change of mind), items must be returned in their original condition and packaging within 14 days of delivery. The customer is responsible for return shipping costs.</p>
  </PageLayout>
);

export const FAQPage = () => (
  <PageLayout title="FAQ">
    <h3 className="text-xl font-bold text-white mb-2">How long do the LEDs last?</h3>
    <p className="mb-6">Our high-efficiency LEDs are rated for 50,000+ hours of continuous use.</p>
    
    <h3 className="text-xl font-bold text-white mb-2">Can I plug it into any wall outlet?</h3>
    <p className="mb-6">Yes, we provide a 12V adapter tailored to your specific country's plug type (US, UK, EU, or AU).</p>
    
    <h3 className="text-xl font-bold text-white mb-2">How heavy is the poster?</h3>
    <p>The total weight including the acrylic backing and LED strip is approximately 1.5kg (3.3 lbs), making it very easy to mount on standard drywall.</p>
  </PageLayout>
);

export const Contact = () => (
  <PageLayout title="Contact Us">
    <p>Need help with your order? Looking for a custom design? We're here to help.</p>
    <div className="space-y-4 font-mono text-sm mt-8">
      <p><strong className="text-white uppercase">Email:</strong> support@wheelsglow.com</p>
      <p><strong className="text-white uppercase">Phone:</strong> +91 999 999 9999</p>
      <p><strong className="text-white uppercase">Hours:</strong> Mon-Fri, 9AM - 6PM IST</p>
    </div>
  </PageLayout>
);

export const PrivacyPolicy = () => (
  <PageLayout title="Privacy Policy">
    <p>Last updated: April 2026</p>
    <p>WheelsGlow ("we", "our", or "us") is committed to protecting your privacy. This policy explains how your personal information is collected, used, and shared when you visit or make a purchase from wheelsglow.com.</p>
    <p>We collect device information using cookies, and order information (name, address, payment info) exclusively to fulfill your orders and screen for potential risk or fraud.</p>
  </PageLayout>
);

export const TermsOfService = () => (
  <PageLayout title="Terms of Service">
    <p>Last updated: April 2026</p>
    <p>By visiting our site and/or purchasing from us, you engage in our "Service" and agree to be bound by the following terms and conditions.</p>
    <p>We reserve the right to refuse service to anyone for any reason at any time. Prices for our products are subject to change without notice.</p>
  </PageLayout>
);
