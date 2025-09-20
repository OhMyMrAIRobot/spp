import { projectsAdapter } from '../slices/projects-slice'
import type { RootState } from '../store'

export const projectsSelectors = projectsAdapter.getSelectors<RootState>(
	state => state.projects
)
