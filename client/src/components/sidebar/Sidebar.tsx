import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import ExitSvg from '../../assets/svg/Exit-svg'
import HomeSvg from '../../assets/svg/Home-svg'
import ListSvg from '../../assets/svg/List-svg'
import ProfileSvg from '../../assets/svg/Profile-svg'
import { ROUTES } from '../../routes/routes'
import { logout } from '../../store/slices/auth.slice'
import type { AppDispatch, RootState } from '../../store/store'
import { UserRoleEnum } from '../../types/user/user-role-enum'
import SidebarItem, { type ISidebarItemProps } from './Sidebar-item'
import SidebarSection from './Sidebar-section'

const Sidebar = () => {
	const { pathname } = useLocation()

	const { user } = useSelector((state: RootState) => state.auth)

	const isActive = (targetPath: string) => {
		return pathname === targetPath
	}

	const dispatch = useDispatch<AppDispatch>()

	const handleLogout = () => {
		dispatch(logout())
	}

	const sidebarItems: ISidebarItemProps[] = [
		{
			path: ROUTES.HOME,
			title: 'Home',
			icon: <HomeSvg className={'size-5'} />,
			isActive: isActive(ROUTES.HOME),
		},
		{
			path: ROUTES.PROJECTS,
			title: 'Projects',
			icon: <ListSvg className={'size-5'} />,
			isActive: isActive(ROUTES.PROJECTS),
		},
		{
			path: ROUTES.PROFILE,
			title: 'Profile',
			icon: <ProfileSvg className={'size-5'} />,
			isActive: isActive(ROUTES.PROFILE),
		},
	] as const

	return (
		<div className='relative z-1000'>
			<aside className='fixed inset-y-0 whitespace-nowrap left-0 w-15 lg:w-60 group overflow-hidden flex flex-col transition-all duration-200 px-3 py-10 gap-y-3'>
				<div className='flex items-center gap-x-2 border-b border-black/5 pb-3'>
					<ProfileSvg className='size-8' />
					<div>
						<p className='font-semibold'>{user?.username}</p>
						<p
							className={`text-xs font-medium ${
								user?.role === UserRoleEnum.ADMIN
									? 'text-red-500'
									: 'text-green-500'
							}`}
						>
							{user?.role}
						</p>
					</div>
				</div>

				<SidebarSection title={'Main Menu'}>
					{sidebarItems.map(item => (
						<SidebarItem key={item.title} {...item} />
					))}
				</SidebarSection>
				<div className='mt-auto'>
					<SidebarItem
						title={'Logout'}
						isActive={false}
						path={'#'}
						icon={<ExitSvg className={'size-5'} />}
						onClick={handleLogout}
					/>
				</div>
			</aside>
		</div>
	)
}

export default Sidebar
