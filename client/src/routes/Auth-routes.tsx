import { Route } from 'react-router-dom'
import HomePage from '../pages/Home-page'
import ProfilePage from '../pages/Profile-page'
import ProjectDetailsPage from '../pages/Project-details-page'
import ProjectsPage from '../pages/Projects-page'
import { ROUTES } from './routes'

const AuthRoutes = () => {
	return (
		<>
			<Route path={ROUTES.HOME} element={<HomePage />} />
			<Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
			<Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetailsPage />} />
			<Route path={ROUTES.PROFILE} element={<ProfilePage />} />

			<Route path={ROUTES.NOT_DEFINED} element={<div>ROUTE NOT DEFINED</div>} />
		</>
	)
}

export default AuthRoutes
