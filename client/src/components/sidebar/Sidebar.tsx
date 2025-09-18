import HomeSvg from '../../assets/svg/Home-svg'
import ListSvg from '../../assets/svg/List-svg'
import ProfileSvg from '../../assets/svg/Profile-svg'
import SidebarItem from './Sidebar-item'
import SidebarSection from './Sidebar-section'

const Sidebar = () => {
	return (
		<div className='relative z-1000'>
			<aside className='fixed inset-y-0 whitespace-nowrap left-0 w-15 lg:w-60 group overflow-hidden flex flex-col transition-all duration-200 px-3 pt-10 gap-y-5'>
				<SidebarSection title={'Main Menu'}>
					<SidebarItem
						title={'Main page'}
						isActive={true}
						icon={<HomeSvg className={'size-5'} />}
					/>
					<SidebarItem
						title={'Profile'}
						isActive={false}
						icon={<ProfileSvg className={'size-5'} />}
					/>
					<SidebarItem
						title={'Projects'}
						isActive={false}
						icon={<ListSvg className={'size-5'} />}
					/>
				</SidebarSection>
			</aside>
		</div>
	)
}

export default Sidebar
