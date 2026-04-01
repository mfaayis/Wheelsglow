import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../components/ProductCard';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // 1. Initial Load: Try localStorage first
  useEffect(() => {
    const savedCart = localStorage.getItem('wheelsglow_cart');
    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch (e) { console.error('Error parsing local cart', e); }
    }
  }, []);

  // 2. Auth Sync: When user logs in, fetch their cloud cart and merge/override
  useEffect(() => {
    if (!user || !db) return;
    const fetchCloudCart = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().cart) {
          const cloudCart = docSnap.data().cart as CartItem[];
          
          setItems(prevLocal => {
            // Simple merge: favor cloud data but keep items that might only be in local
            const merged = [...cloudCart];
            prevLocal.forEach(localItem => {
              if (!merged.find(ci => ci.id === localItem.id)) {
                merged.push(localItem);
              }
            });
            return merged;
          });
        }
        setLoadingInitial(false);
      } catch (e) {
        console.error('Error fetching cloud cart:', e);
      }
    };
    fetchCloudCart();
  }, [user]);

  // 3. Save Changes: Whenever `items` changes, sync to localStorage AND Firestore
  useEffect(() => {
    if (loadingInitial && user) return; // Prevent overwriting cloud cart on first load before fetch
    
    // Save locally
    localStorage.setItem('wheelsglow_cart', JSON.stringify(items));
    
    // Save to Firebase if authenticated
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { cart: items }, { merge: true }).catch(err => {
        console.error("Failed to sync cart to cloud:", err);
      });
    }
  }, [items, user, loadingInitial]);

  const addToCart = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
