import Routes from './routes'
import { SWRConfig } from 'swr'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import { ThemeProvider } from './context/themeContext'



function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <SWRConfig value={{ revalidateOnFocus: false }}>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </SWRConfig>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}

export default App
