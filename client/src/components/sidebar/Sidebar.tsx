import { useLocation } from 'react-router-dom'
import HomeSvg from '../../assets/svg/Home-svg'
import ListSvg from '../../assets/svg/List-svg'
import ProfileSvg from '../../assets/svg/Profile-svg'
import { ROUTES } from '../../routes/routes'
import SidebarItem, { type ISidebarItemProps } from './Sidebar-item'
import SidebarSection from './Sidebar-section'

const Sidebar = () => {
	const { pathname } = useLocation()

	const isActive = (targetPath: string) => {
		return pathname === targetPath
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
			<aside className='fixed inset-y-0 whitespace-nowrap left-0 w-15 lg:w-60 group overflow-hidden flex flex-col transition-all duration-200 px-3 pt-10 gap-y-5'>
				<SidebarSection title={'Main Menu'}>
					{sidebarItems.map(item => (
						<SidebarItem key={item.title} {...item} />
					))}
				</SidebarSection>
			</aside>
		</div>
	)
}

export default Sidebar
