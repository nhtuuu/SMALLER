import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import userAPI from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { getImageURL, isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}

const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userAPI.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation(userAPI.updateProfile)
  const uploadAvatarMutation = useMutation(userAPI.uploadAvatar)

  const {
    register,
    setValue,
    control,
    watch,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const avatar = watch('avatar')

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20 shadow'>
      <Helmet>
        <title>PROFILE | SMALLER</title>
        <meta name='description' content='PROFILE | SMALLER' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>my profile</h1>
        <div className='mt-1 text-sm text-gray-700'>Manage your account information</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:pr-12 md:mt-0'>
          <div className='flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Email</div>
            <div className='pl-5 w-[80%]'>{profile?.email}</div>
          </div>
          <div className='mt-6 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Full name</div>
            <div className='pl-5 w-[80%]'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Full name'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Mobile</div>
            <div className='pl-5 w-[80%]'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    placeholder='Mobile'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Address</div>
            <div className='pl-5 w-[80%]'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Address'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />

          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize' />
            <div className='pl-5 w-[80%]'>
              <Button
                className='flex items-center h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center px-4 md:w-72 md:border-l md:border-l-gray-200'>
          <div className='my-5 h-24 w-24'>
            <img
              src={previewImage || getImageURL(profile?.avatar)}
              alt='icon'
              className='w-full h-full rounded-full object-cover'
            />
          </div>
          <InputFile onChange={handleChangeFile} />
          <div className='mt-2 border-gray-400'>Max size is 1 MB</div>
          <div className='border-gray-400'>Format: .JPEG, .PNG</div>
        </div>
      </form>
    </div>
  )
}
