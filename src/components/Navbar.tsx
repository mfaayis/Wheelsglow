import { Menu, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
      <div className="flex items-center gap-8">
        <Menu className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
        <Link to="/" className="text-3xl tracking-tighter">WheelsGlow</Link>
      </div>
      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-[0.3em]">
          <Link to="/collection" className="hover:text-neon-accent transition-colors">Collection</Link>
          <a href="#" className="hover:text-neon-accent transition-colors">Custom</a>
          <a href="#" className="hover:text-neon-accent transition-colors">About</a>
        </div>
        <div className="flex gap-6">
          <User className="w-5 h-5 cursor-pointer hover:text-neon-accent transition-colors" />
          <Link to="/cart" className="relative cursor-pointer group">
            <ShoppingBag className="w-5 h-5 group-hover:text-neon-accent transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon-accent text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
