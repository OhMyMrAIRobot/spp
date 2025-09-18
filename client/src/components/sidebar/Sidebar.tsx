import SidebarItem from './Sidebar-item'
import SidebarSection from './Sidebar-section'

const Sidebar = () => {
	return (
		<div className='relative z-1000'>
			<aside className='fixed inset-y-0 whitespace-nowrap left-0 w-60 group overflow-hidden flex flex-col transition-all duration-200 px-3 pt-10 gap-y-5'>
				<SidebarSection title={'Main Menu'}>
					<SidebarItem title={'Main page'} isActive={true} />
					<SidebarItem title={'Profile'} isActive={false} />
					<SidebarItem title={'Projects'} isActive={false} />
				</SidebarSection>
			</aside>
		</div>
	)
}

export default Sidebar
