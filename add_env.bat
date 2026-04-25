@echo off
call npx vercel env add VITE_FIREBASE_PROJECT_ID production --value "wheelsglow-318ed" --yes
call npx vercel env add VITE_FIREBASE_STORAGE_BUCKET production --value "wheelsglow-318ed.firebasestorage.app" --yes
call npx vercel env add VITE_FIREBASE_APP_ID production --value "1:795788969919:web:8d5dec999337ef2c3dc30a" --yes
call npx vercel env add VITE_ADMIN_EMAIL production --value "fayismuhammed001@gmail.com" --yes
call npx vercel env add VITE_ADMIN_PASSWORD production --value "fayis001" --yes
call npx vercel env add RESEND_API_KEY production --value "re_3LEJrzay_7oh6FCAVn8vnK9pY7nyTU9VP" --yes
