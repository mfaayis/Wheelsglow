import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CursorBackground } from "./components/CursorBackground";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { About, CustomOrders, ShippingPolicy, Returns, FAQPage, Contact, PrivacyPolicy, TermsOfService } from "./pages/InfoPages";
import { Login, Register } from "./pages/Auth";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { TrackOrder } from "./pages/TrackOrder";

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col pt-[54px]">
                <ScrollToTop />
                <CursorBackground />
                <Navbar />

                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/custom" element={<CustomOrders />} />
                    <Route path="/shipping" element={<ShippingPolicy />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/account" element={<CustomerDashboard />} />
                    <Route path="/track" element={<TrackOrder />} />
                  </Routes>
                </div>

                <Footer />
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
