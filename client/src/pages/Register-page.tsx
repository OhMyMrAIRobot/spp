import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import FormButton from '../components/buttons/Form-button'
import FormInput from '../components/inputs/Form-input'
import FormLabel from '../components/labels/Form-label'
import { ROUTES } from '../routes/routes'
import { clearError, register } from '../store/slices/auth.slice'
import type { AppDispatch, RootState } from '../store/store'

const RegisterPage = () => {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')

	const dispatch = useDispatch<AppDispatch>()

	const { loading, error } = useSelector((state: RootState) => state.auth)

	const handleRegister = () => {
		if (isFormValid) {
			dispatch(register({ username, password }))
		}
	}

	useEffect(() => {
		if (error) {
			if (error.errors && error.errors.length > 0) {
				error.errors.forEach(err => toast.error(err.message))
			} else if (error.message) {
				toast.error(error.message)
			}
			dispatch(clearError())
		}
	}, [dispatch, error])

	const isFormValid = useMemo(() => {
		return (
			username.trim() &&
			password.length >= 8 &&
			password === passwordConfirm.trim()
		)
	}, [password, passwordConfirm, username])

	return (
		<div className='bg-white rounded-xl px-10 py-5 w-full md:w-[450px] grid gap-3'>
			<h1 className='text-3xl font-medium text-center mb-1'>Sign Up</h1>

			<div className='grid gap-1'>
				<FormLabel
					title={'Username'}
					isRequired={true}
					htmlFor='register-username-input'
				/>
				<FormInput
					id={'register-username-input'}
					value={username}
					type={'text'}
					setValue={setUsername}
					placeholder='Your username...'
				/>
			</div>

			<div className='grid gap-1'>
				<FormLabel
					title={'Password'}
					isRequired={true}
					htmlFor='register-password-input'
				/>
				<FormInput
					id={'register-password-input'}
					value={password}
					type={'password'}
					setValue={setPassword}
					placeholder='********'
				/>
			</div>

			<div className='grid gap-1'>
				<FormLabel
					title={'Password confirmation'}
					isRequired={true}
					htmlFor='register-password-confirmation-input'
				/>
				<FormInput
					id={'register-password-confirmation-input'}
					value={passwordConfirm}
					type={'password'}
					setValue={setPasswordConfirm}
					placeholder='********'
				/>
			</div>

			<div className='grid gap-2 mt-6'>
				<FormButton
					onClick={handleRegister}
					title={'Sign Up'}
					disabled={!isFormValid}
					isLoading={loading}
				/>
				<Link
					to={`${ROUTES.AUTH.PREFIX}/${ROUTES.AUTH.LOGIN}`}
					className='flex'
				>
					<FormButton title={'Sign In'} invert={true} />
				</Link>
			</div>
		</div>
	)
}

export default RegisterPage
