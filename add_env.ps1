$env_vars = @{
    "VITE_FIREBASE_AUTH_DOMAIN" = "wheelsglow-318ed.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID" = "wheelsglow-318ed"
    "VITE_FIREBASE_STORAGE_BUCKET" = "wheelsglow-318ed.firebasestorage.app"
    "VITE_FIREBASE_APP_ID" = "1:795788969919:web:8d5dec999337ef2c3dc30a"
    "VITE_ADMIN_EMAIL" = "fayismuhammed001@gmail.com"
    "VITE_ADMIN_PASSWORD" = "fayis001"
    "RESEND_API_KEY" = "re_3LEJrzay_7oh6FCAVn8vnK9pY7nyTU9VP"
}

foreach ($key in $env_vars.Keys) {
    $val = $env_vars[$key]
    cmd /c "npx vercel env add $key production --value `"$val`" --yes"
}
