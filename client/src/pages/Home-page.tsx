import { Link } from 'react-router-dom'
import FormButton from '../components/buttons/Form-button'
import { ROUTES } from '../routes/routes'

const HomePage = () => {
	return (
		<div className='h-fit bg-gray-50 rounded-lg'>
			<div className='flex flex-col items-center py-12 text-center bg-white rounded-lg shadow-md'>
				<h3 className='text-lg font-medium mb-2'>Welcome</h3>
				<p className='text-black/40 mb-4'>
					Track tasks, assign members, and stay organized
				</p>
				<Link to={ROUTES.PROJECTS}>
					<FormButton title={'My Projects!'} />
				</Link>
			</div>
		</div>
	)
}

export default HomePage
