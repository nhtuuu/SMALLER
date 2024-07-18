import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'
import { createSearchParams, Link } from 'react-router-dom'
import purchasesApi from 'src/apis/purchases.api'
import nopurchase from 'src/assets/images/no-purchase.png'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchases.type'
import { createURL, formatCurrency } from 'src/utils/utils'

const tabs = [
  { status: purchasesStatus.all, label: 'All' },
  { status: purchasesStatus.waitforConfirm, label: 'Pending' },
  { status: purchasesStatus.waitForGetting, label: 'Processing' },
  { status: purchasesStatus.inProgress, label: 'Shipped' },
  { status: purchasesStatus.delivered, label: 'Delivered' },
  { status: purchasesStatus.cancelled, label: 'Cancelled' }
]
export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchasesApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div className='overflow-x-auto'>
      <Helmet>
        <title>PURCHASE HISTORY | SMALLER</title>
        <meta name='description' content='PURCHASE HISTORY | SMALLER' />
      </Helmet>
      <div className='min-w-[700px]'>
        <div className='sticky top-0 flex rounded-sm bg-white shadow text-lg'>
          {tabs.map((tab) => (
            <Link
              to={{
                pathname: path.historyPurchase,
                search: createSearchParams({
                  status: String(tab.status)
                }).toString()
              }}
              className={classNames('transition-colors flex flex-1 items-center justify-center py-2 px-3', {
                'text-orange border-b-2 border-orange': status === tab.status,
                'text-gray-900': status !== tab.status
              })}
              key={tab.status}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div>
          {purchasesInCart && purchasesInCart?.length > 0 ? (
            purchasesInCart.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm bg-white shadow-sm border-black/10 p-6 text-gray-600'>
                <Link
                  className='flex'
                  to={`${path.home}${createURL({ name: purchase.product.name, id: purchase.product._id })}`}
                >
                  <div className=' flex-shrink-0'>
                    <img
                      src={purchase.product.image}
                      alt={purchase.product.name}
                      className='h-20 w-20 bg-white object-cover'
                    />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='flex self-center'>
                    <div className='line-through text-gray-500 truncate'>
                      <span className='text-xs'>đ</span>
                      <span>{formatCurrency(purchase.product.price_before_discount)}</span>
                    </div>
                    <div className='text-orange truncate ml-2'>
                      <span className='text-xs'>đ</span>
                      <span>{formatCurrency(purchase.product.price)}</span>
                    </div>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Total:</span>
                    <span className='ml-4 text-xl text-orange'>
                      đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex items-center justify-center h-[600px] bg-white mt-4'>
              <img src={nopurchase} alt='no-purchase' className='h-20 w-20' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
