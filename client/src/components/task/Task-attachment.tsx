import { useState, type FC } from 'react'
import toast from 'react-hot-toast'
import CrossSvg from '../../assets/svg/Cross-svg'
import DownloadSvg from '../../assets/svg/Download-svg'
import FileSvg from '../../assets/svg/File-svg'
import { downloadAttachmentApi } from '../../store/api/attachment-api'
import { useDeleteAttachmentMutation } from '../../store/services/attachment-api-service'
import type { IAttachment } from '../../types/attachments/attachment'
import { formatBytes } from '../../utils/format-bytes'
import { getApiErrorMessages } from '../../utils/get-api-error-messages'
import Loader from '../loaders/Loader'

interface IProps {
	attachment: IAttachment
	taskId: string
	projectId: string
}

const TaskAttachment: FC<IProps> = ({ attachment, taskId, projectId }) => {
	const [downloading, setDownloading] = useState(false)
	const [deleteAttachment, { isLoading: deleting }] =
		useDeleteAttachmentMutation()

	const handleDownload = async () => {
		try {
			if (downloading) return
			setDownloading(true)
			const response = await downloadAttachmentApi(attachment.id)

			const blob = new Blob([response.data], {
				type:
					(response.headers['content-type'] as string) ||
					'application/octet-stream',
			})

			const filename = attachment.originalName

			const objectUrl = URL.createObjectURL(blob)
			try {
				const a = document.createElement('a')
				a.href = objectUrl
				a.download = filename
				a.style.display = 'none'
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
			} finally {
				URL.revokeObjectURL(objectUrl)
			}
		} finally {
			setDownloading(false)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteAttachment({ id: attachment.id, taskId, projectId }).unwrap()
			toast.success('Attachment deleted successfully!')
		} catch (err) {
			const messages = getApiErrorMessages(err)
			if (messages.length) {
				messages.forEach(m => toast.error(m))
			} else {
				toast.error('Something went wrong')
			}
		}
	}

	const disabled = downloading || deleting

	return (
		<div
			className={`flex items-center gap-x-1 w-full ${
				attachment.id.startsWith('temp') ? 'opacity-50 pointer-events-none' : ''
			}`}
		>
			<button
				onClick={handleDelete}
				disabled={disabled}
				className='cursor-pointer p-2 hover:bg-black/10 transition-all duration-200 group rounded-lg disabled:opacity-50'
				title='Delete attachment'
			>
				{deleting ? (
					<Loader className='size-5 border-black' />
				) : (
					<>
						<FileSvg className={'size-5 group-hover:hidden'} />
						<CrossSvg className={'size-5 hidden group-hover:block'} />
					</>
				)}
			</button>

			<div className=' truncate'>{attachment.originalName}</div>

			<div className='flex ml-auto items-center gap-x-1'>
				<div className='text-sm font-medium text-nowrap'>
					{formatBytes(attachment.size)}
				</div>

				<button
					disabled={disabled}
					onClick={handleDownload}
					className={`cursor-pointer p-2 hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center gap-x-1 ${
						disabled ? 'opacity-50 pointer-events-none' : ''
					}`}
					title='Download attachment'
				>
					{downloading ? (
						<Loader className='size-5 border-black' />
					) : (
						<DownloadSvg className={'size-5 stroke-black'} />
					)}
				</button>
			</div>
		</div>
	)
}

export default TaskAttachment
