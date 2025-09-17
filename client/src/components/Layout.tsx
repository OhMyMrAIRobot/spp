import type { FC, ReactNode } from 'react'
import Sidebar from './sidebar/Sidebar'

interface IProps {
	children?: ReactNode
}

const Layout: FC<IProps> = ({ children }) => {
	return (
		<div className='flex w-screen h-screen overflow-hidden'>
			<Sidebar />
			{children}
		</div>
	)
}

export default Layout
