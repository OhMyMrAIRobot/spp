import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
	return (
		<div className='bg-black/5 flex min-h-screen items-center justify-center p-5'>
			<Outlet />
		</div>
	)
}

export default AuthLayout
