import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="px-6 md:px-20 py-20 bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2 space-y-8">
          <h1 className="text-4xl">WheelsGlow</h1>
          <p className="max-w-xs text-white/40 text-sm">
            Elevating your space with the fusion of automotive art and neon technology.
          </p>
          <div className="flex gap-6">
            <Instagram className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
            <Facebook className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-mono text-xs uppercase tracking-widest">Shop</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li className="hover:text-white cursor-pointer"><Link to="/collection">All Posters</Link></li>
            <li className="hover:text-white cursor-pointer">Car Series</li>
            <li className="hover:text-white cursor-pointer">Motorcycle Series</li>
            <li className="hover:text-white cursor-pointer">Custom Orders</li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-mono text-xs uppercase tracking-widest">Support</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li className="hover:text-white cursor-pointer">Shipping Policy</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">FAQ</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
        <p>© 2026 WheelsGlow Store. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
