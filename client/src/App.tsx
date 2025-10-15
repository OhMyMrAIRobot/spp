import { ApolloProvider } from '@apollo/client/react'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import {
	Provider as ReduxProvider,
	useDispatch,
	useSelector,
} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Loader from './components/loaders/Loader'
import { apolloClient } from './graphql/apollo-client'
import AppRoutes from './routes/App-routes'
import { refresh } from './store/slices/auth.slice'
import { store, type AppDispatch, type RootState } from './store/store'

function AppContent() {
	const dispatch = useDispatch<AppDispatch>()
	const { globalLoading } = useSelector((state: RootState) => state.auth)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(refresh())
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
			<ApolloProvider client={apolloClient}>
				<BrowserRouter>
					<AppContent />
					<Toaster position='top-right' />
				</BrowserRouter>
			</ApolloProvider>
		</ReduxProvider>
	)
}

export default App
