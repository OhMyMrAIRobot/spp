import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/layout/Auth-layout'
import Layout from '../components/layout/Layout'
import AuthRoute from './Auth-route'
import AuthRoutes from './Auth-routes'
import NonAuthRoute from './Non-auth-route'
import NonAuthRoutes from './Non-auth-routes'
import { ROUTES } from './routes'

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<NonAuthRoute />}>
				<Route element={<AuthLayout />} path={ROUTES.AUTH.PREFIX}>
					{NonAuthRoutes()}
				</Route>
			</Route>

			<Route element={<AuthRoute />}>
				<Route element={<Layout />}>{AuthRoutes()}</Route>
			</Route>
		</Routes>
	)
}

export default AppRoutes
