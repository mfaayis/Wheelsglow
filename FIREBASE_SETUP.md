# 🔥 Firebase Setup Guide — WheelsGlow

## Step 1: Create a Firebase Project (5 minutes)

1. Go to → **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it: `wheelsglow` → Continue
4. Disable Google Analytics → **Create project**

---

## Step 2: Enable Authentication

1. In Firebase Console → **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method** tab → Enable **Email/Password** → Save

---

## Step 3: Create Your Admin Account

1. In Authentication → **Users** tab → **"Add user"**
2. Enter your email (e.g. `admin@wheelsglow.com`) and a strong password
3. Click **"Add user"**

---

## Step 4: Create Firestore Database

1. In Firebase Console → **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** → Next
4. Choose location: **asia-south1 (Mumbai)** → Enable

### Set Security Rules:
Click the **Rules** tab and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders — anyone can create (checkout), anyone can read by ID (tracking)
    match /orders/{orderId} {
      allow create: if true;
      allow get: if true;
      allow list, update, delete: if request.auth != null;
    }
    // Contacts — anyone can create
    match /contacts/{contactId} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
  }
}
```
Click **Publish**.

---

## Step 5: Get Your Config

1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll down to **"Your apps"** → Click **Web** icon (`</>`)
3. Register app name: `WheelsGlow Web` → **Register app**
4. Copy the `firebaseConfig` object values

---

## Step 6: Add to Vercel

1. Go to **vercel.com** → Your WheelsGlow project → **Settings → Environment Variables**
2. Add each variable from `.env.example`:

| Variable | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | From firebaseConfig |
| `VITE_FIREBASE_AUTH_DOMAIN` | From firebaseConfig |
| `VITE_FIREBASE_PROJECT_ID` | From firebaseConfig |
| `VITE_FIREBASE_STORAGE_BUCKET` | From firebaseConfig |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From firebaseConfig |
| `VITE_FIREBASE_APP_ID` | From firebaseConfig |
| `VITE_ADMIN_EMAIL` | Your admin email |

3. **Redeploy** → Deployments → triple-dot menu → **Redeploy**

---

## Step 7: Also set up locally

Create `.env` in your project root:
```
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_EMAIL=admin@wheelsglow.com
```

Restart: `npm run dev`

---

## ✅ That's it!

- **Admin login**: Go to `/admin` → Enter your email + password
- **Orders**: Saved to Firestore `orders` collection (permanent cloud storage)
- **Messages**: Saved to Firestore `contacts` collection
- **Tracking**: Anyone can track by order ID

---

## Without Firebase (local development)

The site works without Firebase using the Express backend at `server/`.
- Run `node server/index.js` for the local API
- Admin password fallback: `wg-admin-2026`
- Data stored in `server/data.json`
