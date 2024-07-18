import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType } from 'src/types/product.type'
import { createURL, formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'
import path from 'src/constants/path'
import _ from 'lodash'
import productInfo from 'src/constants/productInfo'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  const getProductById = (id: string) => {
    const productDetail = _.find(productInfo, { id })
    return productDetail ? productDetail : null
  }

  const nameId = createURL({ name: getProductById(product._id)?.name as string, id: product._id })

  return (
    <Link to={`${path.home}${nameId}`}>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.04rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 right-0 bg-white w-full h-full object-cover'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>{getProductById(product._id)?.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate'>
              <span className='text-xs'>$</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>$</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold).toLowerCase()}</span>
              <span className='ml-1'>Sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
