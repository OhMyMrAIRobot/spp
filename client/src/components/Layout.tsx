import type { FC, ReactNode } from 'react'
import Sidebar from './sidebar/Sidebar'

interface IProps {
	children?: ReactNode
}

const Layout: FC<IProps> = ({ children }) => {
	return (
		<div className='flex overflow-hidden min-h-screen bg-black/5 py-4 pr-4'>
			<Sidebar />
			<div className='w-full ml-20 lg:ml-60 border border-black/10 rounded-2xl bg-white px-8 py-6'>
				{children}
			</div>
		</div>
	)
}

export default Layout
