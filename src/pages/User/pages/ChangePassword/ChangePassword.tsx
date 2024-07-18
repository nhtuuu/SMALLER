import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userAPI from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])
export default function ChangePassword() {
  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation(userAPI.updateProfile)

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20 shadow'>
      <Helmet>
        <title>CHANGE PASSWORD | SMALLER</title>
        <meta name='description' content='CHANGE PASSWORD | SMALLER' />
      </Helmet>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Change password</h1>
        <div className='mt-1 text-sm text-gray-700'>Manage your account information</div>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:pr-12 md:mt-0'>
          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Old Password</div>
            <div className='pl-5 w-[80%]'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                className='relative'
                register={register}
                name='password'
                type='password'
                placeholder='Old Password'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>New Password</div>
            <div className='pl-5 w-[80%]'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                className='relative'
                register={register}
                name='new_password'
                type='password'
                placeholder='New Password'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-wrap'>
            <div className='truncate w-[20%] text-right capitalize'>Confirm Password</div>
            <div className='pl-5 w-[80%]'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                className='relative'
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Confirm Password'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
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
      </form>
    </div>
  )
}
