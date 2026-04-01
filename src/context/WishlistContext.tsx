import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface WishlistContextType {
  wishlistIds: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // 1. Initial Load: Try localStorage first
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wheelsglow_wishlist');
    if (savedWishlist) {
      try { setWishlistIds(JSON.parse(savedWishlist)); } catch (e) { console.error('Error parsing local wishlist', e); }
    }
  }, []);

  // 2. Auth Sync: When user logs in, fetch their cloud wishlist and merge
  useEffect(() => {
    if (!user || !db) return;
    const fetchCloudWishlist = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().wishlist) {
          const cloudWishlist = docSnap.data().wishlist as number[];
          setWishlistIds(prevLocal => {
            const merged = new Set([...cloudWishlist, ...prevLocal]);
            return Array.from(merged);
          });
        }
        setLoadingInitial(false);
      } catch (e) {
        console.error('Error fetching cloud wishlist:', e);
      }
    };
    fetchCloudWishlist();
  }, [user]);

  // 3. Save Changes: Whenever `wishlistIds` changes, sync to localStorage AND Firestore
  useEffect(() => {
    if (loadingInitial && user) return; // Prevent overwriting cloud data on first load before fetch
    
    // Save locally
    localStorage.setItem('wheelsglow_wishlist', JSON.stringify(wishlistIds));
    
    // Save to Firebase if authenticated
    if (user && db) {
      setDoc(doc(db, 'users', user.uid), { wishlist: wishlistIds }, { merge: true }).catch(err => {
        console.error("Failed to sync wishlist to cloud:", err);
      });
    }
  }, [wishlistIds, user, loadingInitial]);

  const addToWishlist = (productId: number) => {
    setWishlistIds(prev => prev.includes(productId) ? prev : [...prev, productId]);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const toggleWishlist = (productId: number) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
