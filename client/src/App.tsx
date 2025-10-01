import { useEffect } from 'react'
import {
	Provider as ReduxProvider,
	useDispatch,
	useSelector,
} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Loader from './components/loaders/Loader'
import AppRoutes from './routes/App-routes'
import { checkAuth } from './store/slices/auth.slice'
import { store, type AppDispatch, type RootState } from './store/store'

function AppContent() {
	const dispatch = useDispatch<AppDispatch>()
	const { globalLoading } = useSelector((state: RootState) => state.auth)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(checkAuth())
		}
	}, [dispatch])

	if (globalLoading) {
		return (
			<div className='min-h-screen bg-black/5 flex items-center justify-center'>
				<Loader className='size-20 border-black' />
			</div>
		)
	}

	return <AppRoutes />
}

function App() {
	return (
		<ReduxProvider store={store}>
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</ReduxProvider>
	)
}

export default App
