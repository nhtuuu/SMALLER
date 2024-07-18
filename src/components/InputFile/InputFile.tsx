import { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal?.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('Max size is 1 MB. Format: .JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm px-6 bg-white border border-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        Upload an image
      </button>
    </>
  )
}
