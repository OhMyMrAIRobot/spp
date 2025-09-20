import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/App-routes'
import { store } from './store/store'

function App() {
	return (
		<ReduxProvider store={store}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ReduxProvider>
	)
}

export default App
