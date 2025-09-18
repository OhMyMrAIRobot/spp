import { useEffect, useState, type FC } from 'react'
import { createPortal } from 'react-dom'

interface IProps {
	isOpen: boolean
	children: React.ReactNode
	onCancel: () => void
}

const ModalOverlay: FC<IProps> = ({ isOpen, onCancel, children }) => {
	const [isVisible, setIsVisible] = useState(false)
	const [shouldRender, setShouldRender] = useState(false)

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onCancel()
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			setShouldRender(true)
			setTimeout(() => setIsVisible(true), 20)
		} else {
			setIsVisible(false)
			const timer = setTimeout(() => {
				setShouldRender(false)
				document.body.style.overflow = ''
			}, 300)
			return () => {
				clearTimeout(timer)
				document.body.style.overflow = ''
			}
		}
	}, [isOpen])

	useEffect(() => {
		return () => {
			document.body.style.overflow = ''
		}
	}, [])

	if (!shouldRender) return null

	return createPortal(
		<div
			onClick={handleOverlayClick}
			className={`fixed inset-0 w-screen h-screen bg-black/40 flex items-center justify-center select-none transition-opacity duration-300 z-2000 backdrop-blur-sm ${
				isVisible ? 'opacity-100' : 'opacity-0'
			}`}
		>
			<div onClick={e => e.stopPropagation()}>{children}</div>
		</div>,
		document.body
	)
}

export default ModalOverlay
