import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { InformationsProvider } from './contexts/informationsProvider.tsx'

import "./styles/globals.scss"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<InformationsProvider>
		<App />
	</InformationsProvider>
  </StrictMode>,
)
