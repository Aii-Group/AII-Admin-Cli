import { createRoot } from 'react-dom/client'

import App from './App.tsx'

import 'normalize.css'

import '@/utils/i18n.ts'
import '@/styles/global.css'

import './index.css'
import '../preset.js'

createRoot(document.getElementById('root')!).render(<App />)
