import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Package, ShoppingBag, User, LogOut, Clock, Truck, CheckCircle, XCircle, ChevronRight, MapPin, Heart, Trash2 } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCTS } from '../data/products';

interface Order {
  id: string;
  productName: string;
  size: string;
  amount: number;
  status: string;
  trackingId: string;
  createdAt: any;
  address: string;
  city: string;
  pincode: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Processing: { icon: Clock, color: '#FFA500', bg: 'rgba(255,165,0,0.1)' },
  Dispatched: { icon: Package, color: '#00BFFF', bg: 'rgba(0,191,255,0.1)' },
  'In Transit': { icon: Truck, color: '#7B68EE', bg: 'rgba(123,104,238,0.1)' },
  Delivered: { icon: CheckCircle, color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  Cancelled: { icon: XCircle, color: '#FF003D', bg: 'rgba(255,0,61,0.1)' },
};

export function CustomerDashboard() {
  const { user, loading, signOut } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'cart' | 'wishlist'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      loadOrders();
    }
  }, [user, loading, navigate]);

  const loadOrders = async () => {
    if (!db || !user?.email) { setLoadingOrders(false); return; }
    try {
      const q = query(collection(db, 'orders'), where('customerEmail', '==', user.email));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ ...d.data() } as Order));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    } catch { /* Firestore might not have orders yet */ }
    setLoadingOrders(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-accent/30 border-t-neon-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'orders' as const, label: 'My Orders', icon: Package },
    { id: 'cart' as const, label: 'My Cart', icon: ShoppingBag },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen px-4 md:px-10 py-10">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-10 p-8 md:p-12"
        style={{ background: 'linear-gradient(135deg, rgba(255,0,61,0.12) 0%, rgba(0,0,0,0.7) 50%, rgba(0,191,255,0.08) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.photoURL ? (
              <motion.img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl border-2 border-white/10"
                whileHover={{ scale: 1.05 }} />
            ) : (
              <motion.div className="w-16 h-16 rounded-2xl bg-neon-accent/20 border-2 border-neon-accent/30 flex items-center justify-center text-2xl font-display text-neon-accent"
                whileHover={{ scale: 1.05 }}>
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </motion.div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-display tracking-tight">
                Welcome, {user.displayName || user.email?.split('@')[0]}
              </h1>
              <p className="text-white/35 text-sm font-mono mt-1">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/collection">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="bg-neon-accent text-white px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-neon-orange transition-colors flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Shop Now
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSignOut}
              className="border border-white/10 text-white/50 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-widest hover:border-neon-accent/50 hover:text-neon-accent transition-colors flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-neon-accent/15 text-neon-accent border border-neon-accent/25'
                : 'bg-white/3 text-white/40 border border-white/5 hover:bg-white/5 hover:text-white/60'
            }`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.id === 'cart' && totalItems > 0 && (
              <span className="bg-neon-accent text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{totalItems}</span>
            )}
            {tab.id === 'orders' && orders.length > 0 && (
              <span className="bg-white/10 text-white/50 text-[9px] px-1.5 py-0.5 rounded-full">{orders.length}</span>
            )}
            {tab.id === 'wishlist' && wishlistIds.length > 0 && (
              <span className="bg-white/10 text-white/50 text-[9px] px-1.5 py-0.5 rounded-full">{wishlistIds.length}</span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Orders', value: orders.length, icon: Package, color: '#FF003D' },
                { label: 'In Cart', value: totalItems, icon: ShoppingBag, color: '#00BFFF' },
                { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle, color: '#00FF88' },
                { label: 'In Transit', value: orders.filter(o => o.status === 'In Transit' || o.status === 'Dispatched').length, icon: Truck, color: '#7B68EE' },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-3xl font-display">{stat.value}</p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display">Recent Orders</h2>
                {orders.length > 3 && (
                  <button onClick={() => setActiveTab('orders')} className="text-neon-accent text-xs font-mono uppercase tracking-widest hover:underline">
                    View All →
                  </button>
                )}
              </div>
              {loadingOrders ? (
                <div className="glass rounded-2xl p-10 text-center">
                  <div className="w-8 h-8 border-2 border-neon-accent/30 border-t-neon-accent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white/30 text-sm">Loading orders...</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <motion.div className="glass rounded-2xl p-10 text-center border border-white/5">
                  <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 text-sm mb-4">No orders yet — your first LED poster awaits!</p>
                  <Link to="/collection">
                    <motion.button whileHover={{ scale: 1.04 }} className="bg-neon-accent text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest">
                      Browse Collection
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order, i) => {
                    const cfg = statusConfig[order.status] || statusConfig.Processing;
                    const StatusIcon = cfg.icon;
                    return (
                      <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                            <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold">{order.id}</p>
                            <p className="text-white/40 text-xs">{order.productName} · {order.size}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-bold text-sm">₹{order.amount?.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: cfg.color }}>{order.status}</p>
                          </div>
                          <Link to={`/track?order=${order.id}`}>
                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-neon-accent transition-colors" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Preview */}
            {totalItems > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-display">In Your Cart</h2>
                  <Link to="/cart" className="text-neon-accent text-xs font-mono uppercase tracking-widest hover:underline">View Cart →</Link>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/5">
                  {items.slice(0, 3).map((item, i) => {
                    const product = PRODUCTS.find(p => p.id === item.productId);
                    return (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-4">
                          {product && <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                          <div>
                            <p className="text-sm font-medium">{item.productName}</p>
                            <p className="text-white/30 text-xs">{item.size} · Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-4 mt-2">
                    <p className="text-white/40 text-sm">Total: <span className="text-white font-bold">₹{totalPrice.toLocaleString('en-IN')}</span></p>
                    <Link to="/checkout">
                      <motion.button whileHover={{ scale: 1.04 }} className="bg-neon-accent text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
                        Checkout
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-display mb-6">All Orders</h2>
            {loadingOrders ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-2 border-neon-accent/30 border-t-neon-accent rounded-full animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center border border-white/5">
                <Package className="w-16 h-16 text-white/8 mx-auto mb-6" />
                <h3 className="text-xl font-display mb-2">No orders yet</h3>
                <p className="text-white/35 text-sm mb-6">Once you place an order, it'll show up here with live tracking.</p>
                <Link to="/collection">
                  <motion.button whileHover={{ scale: 1.04 }} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest">
                    Start Shopping
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const cfg = statusConfig[order.status] || statusConfig.Processing;
                  const StatusIcon = cfg.icon;
                  const date = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                  return (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="glass rounded-2xl border border-white/5 overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                              <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                            </div>
                            <div>
                              <p className="font-mono text-lg font-bold" style={{ color: cfg.color }}>{order.id}</p>
                              <p className="text-white/30 text-xs font-mono">{date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                              {order.status}
                            </span>
                            <Link to={`/track?order=${order.id}`}>
                              <motion.button whileHover={{ scale: 1.04 }}
                                className="text-[10px] font-mono uppercase tracking-widest text-neon-accent border border-neon-accent/25 px-3 py-1 rounded-full hover:bg-neon-accent/10 transition-colors">
                                Track →
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">Product</p>
                            <p>{order.productName}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">Size</p>
                            <p>{order.size}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">Amount</p>
                            <p className="font-bold">₹{order.amount?.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">Delivery</p>
                            <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/20" />{order.city}</p>
                          </div>
                        </div>
                        {order.trackingId && (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[9px] font-mono uppercase tracking-widest text-white/25 mb-1">Courier Tracking ID</p>
                            <p className="font-mono font-bold text-white/80">{order.trackingId}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── CART TAB */}
        {activeTab === 'cart' && (
          <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-display mb-6">My Cart</h2>
            {totalItems === 0 ? (
              <div className="glass rounded-2xl p-16 text-center border border-white/5">
                <ShoppingBag className="w-16 h-16 text-white/8 mx-auto mb-6" />
                <h3 className="text-xl font-display mb-2">Cart is empty</h3>
                <p className="text-white/35 text-sm mb-6">Browse our collection and add your favorite LED poster.</p>
                <Link to="/collection">
                  <motion.button whileHover={{ scale: 1.04 }} className="bg-neon-accent text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest">
                    Browse Collection
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {items.map((item, i) => {
                    const product = PRODUCTS.find(p => p.id === item.productId);
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-5">
                        {product && <img src={product.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
                        <div className="flex-1">
                          <p className="font-bold text-base">{item.productName}</p>
                          <p className="text-white/35 text-sm mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                          <p className="text-neon-accent font-bold mt-2">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                        <Link to={`/product/${item.productId}`}>
                          <motion.button whileHover={{ scale: 1.05 }} className="text-xs font-mono uppercase tracking-widest text-white/30 hover:text-neon-accent transition-colors">
                            View →
                          </motion.button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-sm">Subtotal</p>
                    <p className="text-2xl font-display">₹{totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <Link to="/checkout">
                    <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255,0,61,0.3)' }}
                      className="bg-neon-accent text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-neon-accent/20">
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-display mb-6">Wishlist</h2>
            {wishlistIds.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center border border-white/5">
                <Heart className="w-16 h-16 text-white/8 mx-auto mb-6" />
                <h3 className="text-xl font-display mb-2">Your wishlist is empty</h3>
                <p className="text-white/35 text-sm mb-6">Explore the collections and hit the heart icon to save items here.</p>
                <Link to="/collection">
                  <motion.button whileHover={{ scale: 1.04 }} className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest">
                    Explore Collection
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistIds.map((id, i) => {
                  const product = PRODUCTS.find(p => p.id === id);
                  if (!product) return null;
                  return (
                    <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass rounded-2xl border border-white/5 overflow-hidden group">
                      <div className="relative aspect-square overflow-hidden bg-black/50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-neon-accent transition-colors border border-white/10">
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg mb-1">{product.name}</h3>
                        <p className="text-neon-accent font-bold mb-4">₹{product.price.toLocaleString('en-IN')}</p>
                        <Link to={`/product/${product.id}`}>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                            <ShoppingBag className="w-3.5 h-3.5" /> View Product
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
