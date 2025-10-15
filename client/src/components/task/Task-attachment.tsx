import { useState, type FC } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { downloadAttachmentApi } from '../../api/attachment-api'
import CrossSvg from '../../assets/svg/Cross-svg'
import DownloadSvg from '../../assets/svg/Download-svg'
import FileSvg from '../../assets/svg/File-svg'
import { useDeleteAttachment } from '../../graphql/hooks/use-attachments'
import { extractApolloErrors } from '../../graphql/utils/apollo-error-handler'
import type { RootState } from '../../store/store'
import type { IAttachment } from '../../types/attachments/attachment'
import type { ITask } from '../../types/tasks/task'
import { UserRoleEnum } from '../../types/users/user-role-enum'
import { formatBytes } from '../../utils/format-bytes'
import Loader from '../loaders/Loader'

interface IProps {
	attachment: IAttachment
	task: ITask
}

const TaskAttachment: FC<IProps> = ({ attachment, task }) => {
	const [downloading, setDownloading] = useState(false)

	const { user } = useSelector((state: RootState) => state.auth)
	const canDelete =
		task.assignee === user?.id || user?.role === UserRoleEnum.ADMIN

	const { deleteAttachment, loading: deleting } = useDeleteAttachment()

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
		} catch (err) {
			const formattedError = extractApolloErrors(err)

			if (
				formattedError.validationErrors &&
				formattedError.validationErrors.length > 0
			) {
				formattedError.validationErrors.forEach(validationErr => {
					toast.error(`${validationErr.field}: ${validationErr.message}`)
				})
			} else {
				toast.error(formattedError.message)
			}
		} finally {
			setDownloading(false)
		}
	}

	const handleDelete = async () => {
		try {
			if (!canDelete) return
			await deleteAttachment(attachment.id, task.id, task.projectId)
			toast.success('Attachment deleted successfully!')
		} catch (err) {
			const formattedError = extractApolloErrors(err)

			if (
				formattedError.validationErrors &&
				formattedError.validationErrors.length > 0
			) {
				formattedError.validationErrors.forEach(validationErr => {
					toast.error(`${validationErr.field}: ${validationErr.message}`)
				})
			} else {
				toast.error(formattedError.message)
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
				className={`p-2 transition-all duration-200 group rounded-lg disabled:opacity-50 ${
					canDelete ? 'hover:bg-black/10 cursor-pointer' : 'cursor-default'
				}`}
				title='Delete attachment'
			>
				{deleting ? (
					<Loader className='size-5 border-black' />
				) : (
					<>
						<FileSvg
							className={`size-5 ${canDelete ? 'group-hover:hidden' : ''}`}
						/>
						{canDelete && (
							<CrossSvg className={'size-5 hidden group-hover:block'} />
						)}
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
