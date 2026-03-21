import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from './context/NotificationContext'
import App from './App'
import store from './store'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </NotificationProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
