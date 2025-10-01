import { Route } from 'react-router-dom'
import LoginPage from '../pages/Login-page'
import RegisterPage from '../pages/Register-page'
import { ROUTES } from './routes'

const NonAuthRoutes = () => {
	return (
		<>
			<Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
			<Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />

			<Route path={ROUTES.AUTH.NOT_DEFINED} element={<LoginPage />} />
		</>
	)
}

export default NonAuthRoutes
