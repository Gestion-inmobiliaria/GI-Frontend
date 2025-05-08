import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/authContext'
import { store } from './redux/store'
import Routes from './routes'
import { ThemeProvider } from './context/themeContext'

// Crear la instancia de QueryClient
const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <SWRConfig value={{ revalidateOnFocus: false }}>
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </SWRConfig>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
