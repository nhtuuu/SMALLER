import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Helmet>
        <title>REGISTER | SMALLER</title>
        <meta name='description' content='Register | SMALLER' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Register</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
                // rules={rules.email}
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                classNameEye='h-5 w-5 absolute top-[12px] right-2 cursor-pointer'
                errorMessage={errors.password?.message}
                placeholder='Password'
                // rules={rules.password}
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                classNameEye='h-5 w-5 absolute top-[12px] right-2 cursor-pointer'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                // rules={rules.confirm_password}
              />
              <div className='mt-2'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Register
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <div className='span text-gray-400'>Have an account?</div>
                  <Link className='text-red-400 ml-1' to='/login'>
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
