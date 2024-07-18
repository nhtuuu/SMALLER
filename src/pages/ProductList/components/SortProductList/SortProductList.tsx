import { sortBy, order as orderConstant } from 'src/constants/product'
import { ProductListConfig } from 'src/types/product.type'
import classNames from 'classnames'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sortByValue === sort_by
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sort By</div>
          <button
            className={classNames('h-8 px-4 capitalize  text-black text-sm text-center', {
              'bg-orange hover:bg-orange/80 text-white': isActiveSortBy(sortBy.view),
              'bg-white hover:bg-slate-100 ': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Most Popular
          </button>
          <button
            className={classNames('h-8 px-4 capitalize  text-black text-sm text-center', {
              'bg-orange hover:bg-orange/80 text-white': isActiveSortBy(sortBy.createdAt),
              'bg-white hover:bg-slate-100 ': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            New Arrivals
          </button>
          <button
            className={classNames('h-8 px-4 capitalize  text-black text-sm text-center', {
              'bg-orange hover:bg-orange/80 text-white': isActiveSortBy(sortBy.sold),
              'bg-white hover:bg-slate-100 ': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Best Sellers
          </button>
          <select
            className={classNames('h-8 px-4 capitalize text-sm text-left outline-none', {
              'bg-orange hover:bg-orange/80 text-white': isActiveSortBy(sortBy.price),
              'bg-white text-black  hover:bg-slate-100 ': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option className='bg-white text-black' value='' disabled>
              Price
            </option>
            <option className='bg-white text-black' value={orderConstant.asc}>
              Price: Low to high
            </option>
            <option className='bg-white text-black' value={orderConstant.desc}>
              Price: High to low
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex ml-2'>
            {page === 1 ? (
              <span className='flex items-center justify-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex items-center justify-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center w-9 h-8 rounded-tr-sm rounded-br-sm bg-white hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-3 h-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
