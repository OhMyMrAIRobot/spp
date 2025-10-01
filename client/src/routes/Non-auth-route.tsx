import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../store/store'
import { ROUTES } from './routes'

const NonAuthRoute = () => {
	const { user, globalLoading } = useSelector((state: RootState) => state.auth)

	if (globalLoading) return null

	return !user ? <Outlet /> : <Navigate to={`${ROUTES.HOME}`} replace />
}

export default NonAuthRoute
