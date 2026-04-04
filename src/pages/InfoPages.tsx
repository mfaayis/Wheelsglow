import { motion } from "framer-motion";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { api } from "../lib/api";

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="px-6 md:px-20 py-12 min-h-[80vh] max-w-4xl mx-auto">
    <SEO title={`${title} | WheelsGlow`} />
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
    <p>Contact us at <strong>wheelsglow.store@gmail.com</strong> with your request for a quote.</p>
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

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.sendContact(formData);
      setStatus("success");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <PageLayout title="Contact Us">
      <p>Need help with your order? Looking for a custom design? We're here to help.</p>
      
      <div className="mt-8 grid md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Phone (Optional)</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-accent transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Message</label>
            <textarea required rows={4} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-accent transition-colors resize-none" />
          </div>
          
          {status === "error" && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {status === "success" && <p className="text-green-500 text-sm">Thanks for reaching out! We'll get back to you soon.</p>}
          
          <button disabled={status === "loading"} type="submit" className="w-full py-4 bg-neon-accent text-white font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-neon-orange transition-colors disabled:opacity-50">
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="space-y-4 font-mono text-sm">
          <h3 className="text-xl font-sans font-bold text-white mb-6">Contact Information</h3>
          <p><strong className="text-white uppercase inline-block min-w-[80px]">Email:</strong> wheelsglow.store@gmail.com</p>
          <p><strong className="text-white uppercase inline-block min-w-[80px]">Phone:</strong> +91 999 5664 588</p>
          <p><strong className="text-white uppercase inline-block min-w-[80px]">Hours:</strong> Mon-Fri, 9AM - 6PM IST</p>
        </div>
      </div>
    </PageLayout>
  );
};

export const PrivacyPolicy = () => (
  <PageLayout title="Privacy Policy">
    <p>Last updated: April 2026</p>
    <p>WheelsGlow ("we", "our", or "us") is committed to protecting your privacy. This policy explains how your personal information is collected, used, and shared when you visit or make a purchase from wheelsglow.store.</p>
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
