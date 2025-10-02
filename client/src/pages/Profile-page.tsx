import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/auth.slice'
import type { AppDispatch, RootState } from '../store/store'

const ProfilePage = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { user } = useSelector((state: RootState) => state.auth)

	if (!user)
		return <div className='p-6 text-center'>You are not logged in.</div>

	return (
		<div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md grid gap-6'>
			<div className='flex items-center gap-4'>
				<div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600'>
					{user.username[0].toUpperCase()}
				</div>
				<div className='flex flex-col'>
					<h2 className='text-2xl font-semibold'>{user.username}</h2>
					<span className='text-gray-500 capitalize'>{user.role}</span>
				</div>
			</div>

			<div className='grid gap-2'>
				<div className='flex justify-between text-gray-600'>
					<span>User ID:</span>
					<span>{user.id}</span>
				</div>
				<div className='flex justify-between text-gray-600'>
					<span>Role:</span>
					<span className='capitalize'>{user.role}</span>
				</div>
			</div>

			<button
				onClick={() => dispatch(logout())}
				className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
			>
				Logout
			</button>
		</div>
	)
}

export default ProfilePage
