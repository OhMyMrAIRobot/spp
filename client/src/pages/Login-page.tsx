import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FormButton from '../components/buttons/Form-button'
import FormInput from '../components/inputs/Form-input'
import FormLabel from '../components/labels/Form-label'
import { ROUTES } from '../routes/routes'
import { clearError, login } from '../store/slices/auth.slice'
import type { AppDispatch, RootState } from '../store/store'

const LoginPage = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const dispatch = useDispatch<AppDispatch>()

	const { loading, error } = useSelector((state: RootState) => state.auth)

	const isFormValid = useMemo(() => {
		return username.trim() && password.length >= 8
	}, [username, password])

	const handleLogin = () => {
		dispatch(login({ username, password }))
	}

	useEffect(() => {
		if (error) {
			if (error.validationErrors && error.validationErrors.length > 0) {
				error.validationErrors.forEach(err => {
					toast.error(`${err.field}: ${err.message}`)
				})
			} else {
				toast.error(error.message)
			}

			dispatch(clearError())
		}
	}, [dispatch, error])

	return (
		<div className='bg-white rounded-xl px-10 py-5 w-full md:w-[450px] grid gap-3'>
			<h1 className='text-3xl font-medium text-center mb-1'>Sign In</h1>

			<div className='grid gap-1'>
				<FormLabel
					title={'Username'}
					isRequired={true}
					htmlFor='login-username-input'
				/>
				<FormInput
					id='login-username-input'
					value={username}
					type='text'
					setValue={setUsername}
					placeholder='Your username...'
				/>
			</div>

			<div className='grid gap-1'>
				<FormLabel
					title={'Password'}
					isRequired={true}
					htmlFor='login-password-input'
				/>
				<FormInput
					id='login-password-input'
					value={password}
					type='password'
					setValue={setPassword}
					placeholder='********'
				/>
			</div>

			<div className='grid gap-2 mt-6'>
				<FormButton
					onClick={handleLogin}
					title={'Sign In'}
					disabled={!isFormValid || loading}
					isLoading={loading}
				/>
				<Link
					to={`${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.REGISTER}`}
					className='flex'
				>
					<FormButton onClick={() => {}} title={'Sign Up'} invert={true} />
				</Link>
			</div>
		</div>
	)
}

export default LoginPage
