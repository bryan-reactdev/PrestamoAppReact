import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './global/styles/tailwind.css'
import './global.css'
import './global/styles/layout.css'
import './global/styles/layout-mobile.css'
import './global/styles/tables.css'
import './global/styles/cards.css'
import './global/styles/modals.css'

import App from './App'

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <App />
    // </StrictMode>
)
