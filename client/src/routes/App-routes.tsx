import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import { RouteList } from './Route-lists'

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route element={<Layout />}>{RouteList()}</Route>
		</Routes>
	)
}

export default AppRoutes
