import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './context/AuthContext.tsx'

export const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</BrowserRouter>
)
