import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";


createRoot(document.getElementById('root')).render(
   <StrictMode>
    <GoogleOAuthProvider clientId="454867293155-u8gfoms7vaco4alp0ls2q0v1bmnkh1b1.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
