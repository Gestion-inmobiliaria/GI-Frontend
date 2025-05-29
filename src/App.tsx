import Routes from './routes'
import { SWRConfig } from 'swr'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { ThemeProvider } from './context/themeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


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
