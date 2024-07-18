import { useContext } from 'react'
import Popover from '../Popover'
import { AppContext } from 'src/contexts/app.context'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import authApi from 'src/apis/auth.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'
import { getImageURL } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { local } from 'src/i18n/i18n'

export default function NavHeader() {
  const { i18n } = useTranslation()
  const currentLanguage = local[i18n.language as keyof typeof local]
  const queryClient = useQueryClient()

  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLang = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='flex justify-end'>
      <Popover
        className='flex items-center py-1 hover:text-white/70 cursor-pointer'
        renderPopover={
          <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
            <div className='flex flex-col px-3 py-2'>
              <button className='py-3 px-4 hover:text-orange' onClick={() => changeLang('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 hover:text-white/70 cursor-pointer ml-6'
          renderPopover={
            <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
              <div className='flex flex-col px-3 py-2'>
                <Link to={path.profile} className='block py-3 px-4 bg-white hover:bg-slate-100 hover:text-cyan-500'>
                  My Account
                </Link>
                <Link to={path.cart} className='block py-3 px-4 bg-white hover:bg-slate-100 hover:text-cyan-500'>
                  My Cart
                </Link>
                <button
                  className='block py-3 px-4 bg-white hover:bg-slate-100 hover:text-cyan-500 text-left'
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          }
        >
          <div className='w-6 h-6 mr-2 flex-shrink-0'>
            <img src={getImageURL(profile?.avatar)} alt='avatar' className='w-full h-full object-cover rounded-full' />
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Register
          </Link>
          <div className='border-r-[1px] border-r-white/40 h-4'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
