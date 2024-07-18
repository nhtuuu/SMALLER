import classNames from 'classnames'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getImageURL } from 'src/utils/utils'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)

  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={getImageURL(profile?.avatar)} alt='avatar' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <span className='mb-1 truncate font-semibold text-gray-600'>{profile?.email}</span>
          <Link to={path.profile} className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-4 w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
            <span className='ml-1'>Edit Profile</span>
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('flex items-center  transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 w-[22px] h-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
              alt='icon'
              className='w-full h-full'
            />
          </div>
          My account
        </NavLink>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 w-[22px] h-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/e10a43b53ec8605f4829da5618e0717c'
              alt='icon'
              className='w-full h-full'
            />
          </div>
          Change password
        </NavLink>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 w-[22px] h-[22px]'>
            <img
              src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
              alt='icon'
              className='w-full h-full'
            />
          </div>
          Your orders
        </NavLink>
      </div>
    </div>
  )
}
