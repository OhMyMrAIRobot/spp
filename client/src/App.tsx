import { useState } from 'react'
import Layout from './components/Layout'
import { mockProjects } from './data'
import ProjectsPage from './pages/Projects-page'

function App() {
	const [projects] = useState(mockProjects)

	return (
		<Layout>
			{/* <ProjectPage project={projects[0]} /> */}
			<ProjectsPage projects={projects} />
		</Layout>
	)
}

export default App
