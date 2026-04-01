import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, orderBy, Timestamp, setDoc, deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';
import { api } from './api'; // Express fallback

// ── Unique WheelsGlow order ID
const genOrderId = () => `WG${Date.now().toString().slice(-7)}`;

// ── Unified data layer — uses Firestore if configured, else Express API
export const dataApi = {

  // ── PUBLIC: Track order by ID
  trackOrder: async (orderId: string) => {
    if (!isFirebaseReady || !db) {
      return api.trackOrder(orderId).then(r => r.data);
    }
    const snap = await getDoc(doc(db, 'orders', orderId.toUpperCase()));
    if (!snap.exists()) throw new Error('Order not found');
    const d = snap.data();
    return { ...d, createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt };
  },

  // ── PUBLIC: Create order (checkout)
  createOrder: async (payload: {
    customerName: string; customerEmail: string; customerPhone: string;
    address: string; city: string; state: string; pincode: string;
    productId: number; productName: string; size: string; amount: number; notes?: string;
  }) => {
    if (!isFirebaseReady || !db) {
      const r = await api.placeOrder(payload);
      return r.data.orderId;
    }
    const orderId = genOrderId();
    const orderData = {
      ...payload,
      id: orderId,
      status: 'Processing',
      trackingId: '',
      createdAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'orders', orderId), orderData);

    // Send confirmation email via serverless function (non-blocking)
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'order_confirmation', order: { ...payload, id: orderId, amount: payload.amount } }),
    }).catch(() => {}); // silent fail — email is non-critical

    return orderId;
  },

  // ── PUBLIC: Save contact message
  submitContact: async (payload: { name: string; email: string; phone?: string; message: string }) => {
    if (!isFirebaseReady || !db) {
      return api.sendContact(payload);
    }
    await addDoc(collection(db, 'contacts'), { ...payload, createdAt: Timestamp.now() });
  },

  // ── ADMIN: Get all orders (newest first)
  getOrders: async (filterStatus?: string, search?: string) => {
    if (!isFirebaseReady || !db) {
      const r = await api.admin.getOrders({ status: filterStatus, search });
      return { orders: r.data, stats: r.stats };
    }
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
    let orders = snap.docs.map(d => {
      const data = d.data();
      return { ...data, id: d.id, createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt };
    });
    if (filterStatus && filterStatus !== 'All') orders = orders.filter((o: any) => o.status === filterStatus);
    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter((o: any) =>
        o.id?.toLowerCase().includes(s) || o.customerName?.toLowerCase().includes(s) || o.productName?.toLowerCase().includes(s)
      );
    }
    const stats = {
      total: snap.size,
      revenue: snap.docs.reduce((s, d) => s + (d.data().amount || 0), 0),
      delivered: snap.docs.filter(d => d.data().status === 'Delivered').length,
      inTransit: snap.docs.filter(d => ['In Transit', 'Dispatched'].includes(d.data().status)).length,
      processing: snap.docs.filter(d => d.data().status === 'Processing').length,
    };
    return { orders, stats };
  },

  // ── ADMIN: Update order status / tracking
  updateOrder: async (orderId: string, body: { status?: string; trackingId?: string }) => {
    if (!isFirebaseReady || !db) return api.admin.updateOrder(orderId, body);
    await updateDoc(doc(db, 'orders', orderId), { ...body, updatedAt: Timestamp.now() });
  },

  // ── ADMIN: Delete order
  deleteOrder: async (orderId: string) => {
    if (!isFirebaseReady || !db) return api.admin.deleteOrder(orderId);
    await deleteDoc(doc(db, 'orders', orderId));
  },

  // ── ADMIN: Get contacts
  getContacts: async () => {
    if (!isFirebaseReady || !db) {
      return api.admin.getContacts().then(r => r.data);
    }
    const snap = await getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  },
};
