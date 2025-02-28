import { Link } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from 'src/contexts/app.context'
import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import path from 'src/constants/path'
import purchasesApi from 'src/apis/purchases.api'
import { purchasesStatus } from 'src/constants/purchase'
import { createURL, formatCurrency } from 'src/utils/utils'
import noproduct from 'src/assets/images/no-product.png'
import NavHeader from '../NavHeader'
import useSearchProducts from 'src/hooks/useSearchProducts'
import productInfo from 'src/constants/productInfo'
import _ from 'lodash'

export default function Header() {
  const MAX_PURCHASES = 5
  const { isAuthenticated } = useContext(AppContext)
  const { handleSearchSubmit, register } = useSearchProducts()

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchasesApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const getProductById = (id: string) => {
    const productDetail = _.find(productInfo, { id })
    return productDetail ? productDetail : null
  }

  return (
    <div className='pb-5 pt-2 bg-[linear-gradient(-180deg,#f53d2d,#f63)] text-white'>
      <div className='container'>
        <NavHeader />
        <div className='grid grid-cols-12 gap-4 mt-4 items-end'>
          <Link to='/' className='col-span-2'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 95 30' fill='none' className='h-11 w-full'>
              <path
                d='M40.9775 20.8991C43.9153 20.8991 45.2209 19.4043 45.2209 17.6002C45.2209 15.8648 44.276 14.7824 42.1114 14.3356L40.1529 13.9233C38.5724 13.5796 38.1085 13.2875 38.1085 12.2395C38.1085 11.2257 38.7957 10.7446 40.4965 10.7446C42.5581 10.7446 43.1765 11.4835 43.1765 12.8924V13.0814H44.9976V12.8752C44.9976 10.8305 43.7263 9.04364 40.548 9.04364C37.5759 9.04364 36.2531 10.6244 36.2531 12.3254C36.2531 14.1466 37.3183 15.1088 39.2939 15.4868L41.2524 15.882C43.0219 16.2428 43.3655 16.6208 43.3655 17.6689C43.3655 18.7342 42.747 19.1981 41.0462 19.1981C38.6411 19.1981 38.0398 18.4765 38.0398 17.0504V16.8614H36.2188V17.1535C36.2188 19.3699 37.6618 20.8991 40.9775 20.8991Z'
                className='fill-white'
              />
              <path
                d='M48.4939 20.7273V15.7445C48.4939 14.1982 49.1468 13.614 50.5555 13.614C52.1017 13.614 52.5655 14.2497 52.5655 15.7789V20.7273H54.4209V15.7617C54.4209 14.1982 55.0738 13.614 56.4825 13.614C58.0287 13.614 58.4925 14.2497 58.4925 15.7789V20.7273H60.3479V15.3665C60.3479 13.425 59.3687 12.0161 57.1697 12.0161C55.4861 12.0161 54.6099 12.8924 54.2148 13.7858H54.1632C53.7509 12.7034 52.8232 12.0161 51.3286 12.0161C49.6965 12.0161 48.8032 12.8752 48.408 13.7858H48.3393V12.1879H46.6385V20.7273H48.4939Z'
                className='fill-white'
              />
              <path
                d='M64.4266 20.8991C66.0415 20.8991 67.0208 20.1946 67.519 19.3871H67.6049V20.7273H69.3228V15.5384C69.3228 13.4594 68.1203 12.0161 65.7323 12.0161C63.4474 12.0161 61.9527 13.3906 61.9527 15.2978V15.4696H63.7394V15.2119C63.7394 14.0779 64.272 13.6484 65.6292 13.6484C66.9692 13.6484 67.5533 14.0264 67.5533 15.2978V15.7617L64.5641 16.2085C62.743 16.4662 61.7122 17.205 61.7122 18.6139C61.7122 20.1087 62.8976 20.8991 64.4266 20.8991ZM63.5161 18.4765C63.5161 17.8407 63.8597 17.6174 64.8389 17.4799L67.5533 17.0675V17.2222C67.5533 18.9404 66.2305 19.4215 65.0279 19.4215C63.9456 19.4215 63.5161 19.1465 63.5161 18.4765Z'
                className='fill-white'
              />
              <path d='M72.9549 20.7273V9.21545H71.0995V20.7273H72.9549Z' className='fill-white' />
              <path d='M76.6962 20.7273V9.21545H74.8408V20.7273H76.6962Z' className='fill-white' />
              <path
                d='M82.2445 20.8991C84.5466 20.8991 86.0756 19.7651 86.0756 18.0125V17.8579H84.2374V17.9954C84.2374 18.7685 83.6876 19.2496 82.2617 19.2496C80.475 19.2496 79.9081 18.4593 79.8394 16.8957H86.0413C86.0928 16.638 86.1443 16.1741 86.1443 15.7274C86.1443 13.3906 84.5294 12.0161 82.2274 12.0161C79.6848 12.0161 78.1042 13.803 78.1042 16.449C78.1042 19.1122 79.4271 20.8991 82.2445 20.8991ZM82.193 13.5796C83.6533 13.5796 84.4435 14.1982 84.3748 15.6586H79.8566C79.9596 14.3356 80.5781 13.5796 82.193 13.5796Z'
                className='fill-white'
              />
              <path
                d='M89.4803 20.7273V15.1604C89.4803 14.0264 89.8926 13.5968 91.0093 13.5968C92.0916 13.5968 92.418 14.0092 92.418 15.1432V15.4868H94.2734V14.9198C94.2734 13.3219 93.5862 12.0161 91.7995 12.0161C90.5454 12.0161 89.7552 12.7034 89.4116 13.4937H89.3257V12.1364H87.6249V20.7273H89.4803Z'
                className='fill-white'
              />
              <path
                d='M0.654155 7.25301C1.14731 3.82311 3.82695 1.17132 7.25645 0.678263C9.74306 0.320766 12.6332 0 14.9982 0C17.3632 0 20.2533 0.320767 22.7399 0.678263C26.1694 1.17132 28.849 3.82311 29.3422 7.25301C29.6898 9.67108 29.9963 12.5091 29.9963 15C29.9963 17.5014 29.6873 20.3528 29.3378 22.7775C28.8457 26.1916 26.186 28.8368 22.7724 29.329C20.3129 29.6835 17.4352 30 14.9982 30C12.5611 30 9.68344 29.6835 7.22397 29.329C3.81035 28.8368 1.15063 26.1916 0.65855 22.7775C0.30907 20.3528 0 17.5014 0 15C0 12.5091 0.306483 9.67108 0.654155 7.25301Z'
                className='fill-white'
              />
              <path
                d='M15.454 23.2628C19.589 23.2628 21.4267 21.1588 21.4267 18.6195C21.4267 16.1769 20.0968 14.6533 17.05 14.0245L14.2933 13.4441C12.0687 12.9604 11.4158 12.5493 11.4158 11.074C11.4158 9.64718 12.383 8.97003 14.7769 8.97003C17.6787 8.97003 18.5492 10.0099 18.5492 11.993V12.2591H21.1124V11.9689C21.1124 9.09095 19.323 6.57581 14.8495 6.57581C10.6662 6.57581 8.80422 8.80074 8.80422 11.195C8.80422 13.7585 10.3034 15.1128 13.0843 15.6448L15.8409 16.2011C18.3316 16.7089 18.8152 17.241 18.8152 18.7162C18.8152 20.2156 17.9447 20.8686 15.5507 20.8686C12.1654 20.8686 11.3191 19.8528 11.3191 17.8456V17.5795H8.75586V17.9907C8.75586 21.1104 10.7871 23.2628 15.454 23.2628Z'
                className='fill-orange'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M9.88189 7.55216C11.001 6.58352 12.6589 6 14.85 6C17.1942 6 18.9208 6.66104 20.0624 7.78227C21.2029 8.90228 21.6887 10.412 21.6887 11.9689V12.8349H17.974V11.993C17.974 11.0734 17.7714 10.5202 17.3726 10.1712C16.9519 9.80305 16.1846 9.54584 14.7775 9.54584C13.6106 9.54584 12.9086 9.71556 12.5104 9.97141C12.1682 10.1913 11.9921 10.5125 11.9921 11.074C11.9921 11.719 12.129 11.9831 12.3771 12.1785C12.6989 12.432 13.2871 12.6359 14.4143 12.881C14.415 12.8811 14.4156 12.8813 14.4162 12.8814L17.1669 13.4606C17.1672 13.4606 17.1674 13.4607 17.1677 13.4607C18.7571 13.7889 19.9787 14.3658 20.8025 15.249C21.6371 16.1439 22.003 17.288 22.003 18.6195C22.003 20.0345 21.4865 21.3628 20.3679 22.3291C19.2572 23.2886 17.615 23.8386 15.4546 23.8386C13.042 23.8386 11.2144 23.2831 9.98239 22.2353C8.73625 21.1754 8.18066 19.6815 8.18066 17.9907V17.0037H11.8953V17.8456C11.8953 18.7806 12.093 19.3161 12.5243 19.6591C12.9975 20.0355 13.8835 20.2928 15.5513 20.2928C16.7245 20.2928 17.3913 20.1269 17.758 19.8781C18.0669 19.6686 18.24 19.3447 18.24 18.7162C18.24 18.0332 18.1261 17.743 17.882 17.5279C17.5778 17.2599 16.9786 17.0206 15.7271 16.7654C15.7269 16.7654 15.7267 16.7653 15.7264 16.7653L12.9738 16.2098C11.5242 15.9321 10.3288 15.4264 9.49402 14.588C8.64386 13.7342 8.22903 12.5976 8.22903 11.195C8.22903 9.84284 8.75823 8.52474 9.88189 7.55216ZM10.6354 8.42295C9.78227 9.16139 9.38051 10.1529 9.38051 11.195C9.38051 12.3558 9.71528 13.1782 10.3099 13.7754C10.9194 14.3875 11.863 14.8248 13.193 15.0793L13.1958 15.0798L15.9565 15.6369C17.1952 15.8894 18.0829 16.1701 18.6432 16.6638C19.2635 17.2105 19.3915 17.924 19.3915 18.7162C19.3915 19.5871 19.1293 20.3394 18.4044 20.8312C17.7374 21.2837 16.772 21.4444 15.5513 21.4444C13.8338 21.4444 12.6039 21.1938 11.8076 20.5605C11.0508 19.9586 10.7935 19.1047 10.7506 18.1554H9.33421C9.36848 19.5075 9.82841 20.5926 10.7284 21.358C11.6787 22.1663 13.2002 22.687 15.4546 22.687C17.4291 22.687 18.7733 22.1849 19.6152 21.4576C20.4492 20.7371 20.8515 19.7437 20.8515 18.6195C20.8515 17.5083 20.5525 16.6693 19.9604 16.0346C19.3577 15.3883 18.3912 14.8891 16.9342 14.5884L16.9319 14.588L14.1716 14.0068C13.0753 13.7684 12.2253 13.5249 11.6646 13.0832C11.0301 12.5834 10.8406 11.9043 10.8406 11.074C10.8406 10.2087 11.1481 9.47792 11.888 9.00252C12.5719 8.56308 13.5505 8.39422 14.7775 8.39422C16.2721 8.39422 17.3909 8.65697 18.1309 9.30453C18.8181 9.9059 19.0747 10.7443 19.1185 11.6832H20.5307C20.4754 10.4772 20.0649 9.39876 19.2557 8.60396C18.3842 7.74815 16.9794 7.15162 14.85 7.15162C12.8579 7.15162 11.4931 7.68057 10.6354 8.42295Z'
                className='fill-orange'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_16163_58'
                  x1='15.0913'
                  y1='6.57581'
                  x2='15.0913'
                  y2='23.2628'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0.349604' stopColor='white' />
                  <stop offset={1} stopColor='white' stopOpacity='0.89' />
                </linearGradient>
                <linearGradient
                  id='paint1_linear_16163_58'
                  x1='15.032'
                  y1='9.96925'
                  x2='15.032'
                  y2='29.9307'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop offset='0.24162' stopColor='white' stopOpacity='0.98' />
                  <stop offset='0.707081' stopColor='white' stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
          </Link>
          <form className='col-span-9' onSubmit={handleSearchSubmit}>
            <div className='bg-white rounded-sm p-1 flex'>
              <input
                type='text'
                placeholder='FREESHIP FROM $0'
                className='text-black px-3 py-2 flex-grow border-none outline-none bg-transparent'
                {...register('name')}
              />
              <button className='rounded-sm py-2 px-6 flex-shrink-0 bg-orange hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-center'>
            <Popover
              className='py-1 hover:text-white/70 cursor-pointer'
              renderPopover={
                <div className='bg-white relative shadow-md rounded-sm border border-gray-200 max-w-[400px] px-3 py-2'>
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <span className='text-gray-300'>Recently Added</span>
                      <div className='mt-5'></div>
                      {purchasesInCart?.slice(0, 5).map((purchase) => (
                        <Link
                          to={`${path.home}${createURL({
                            name: getProductById(purchase.product._id)?.name as string,
                            id: purchase.product._id
                          })}`}
                          className='mt-2 flex py-2 hover:bg-gray-100'
                          key={purchase._id}
                        >
                          <div className='flex-shrink-0'>
                            <img
                              src={purchase.product.image}
                              alt={getProductById(purchase.product._id)?.name}
                              className='h-11 w-11 object-cover'
                            />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>{getProductById(purchase.product._id)?.name}</div>
                          </div>
                          <div className='ml-2 flex-shrink-0'>
                            <span className='text-orange'>${formatCurrency(purchase.product.price)}</span>
                          </div>
                        </Link>
                      ))}
                      <div className='flex items-center justify-between mt-6'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesInCart.length > MAX_PURCHASES
                            ? `${purchasesInCart.length - MAX_PURCHASES} More In Your Cart`
                            : ''}
                        </div>
                        <Link to={path.cart} className='bg-orange text-white px-3 py-2'>
                          Your Cart
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                      <img src={noproduct} alt='no-items' className='h-24 w-24' />
                      <div className='mt-3'>Your Cart is Empty</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to={path.cart} className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {purchasesInCart && purchasesInCart.length > 0 && (
                  <span className='absolute top-[-5px] left-[17px] rounded-full px-[9px] py-[1px] text-xs text-orange bg-white'>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
