import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, rateSale } from 'src/utils/utils'
import Product from '../ProductList/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchasesApi from 'src/apis/purchases.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import path from 'src/constants/path'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'
import _ from 'lodash'
import productInfo from 'src/constants/productInfo'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = (nameId as string).split('-ii')[1]
  const { data: productData } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => {
      return productApi.getProductDetails(id as string)
    }
  })
  const product = productData?.data.data

  const [imagesIndex, setImagesIndex] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')

  const currentImages = useMemo(() => (product ? product.images.slice(...imagesIndex) : []), [product, imagesIndex])

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    if (imagesIndex[1] < (product as ProductType).images.length) {
      setImagesIndex((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (imagesIndex[0] > 0) {
      setImagesIndex((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoom = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    const offsetX = e.pageX - (rect.x + window.scrollX)
    const offsetY = e.pageY - (rect.y + window.scrollY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleZoomOut = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const queryClient = useQueryClient()

  const addToCartMutation = useMutation(purchasesApi.addToCart)

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, { state: { purchaseId: purchase._id } })
  }

  const getProductById = (id: string) => {
    const productDetail = _.find(productInfo, { id })
    return productDetail ? productDetail : null
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>{product.name} | SMALLER</title>
        <meta name='description' content={convert(product.description, { limits: { maxInputLength: 150 } })} />
      </Helmet>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleZoomOut}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img, index) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative pt-[100%]' key={index}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full bg-white object-cover cursor-pointer'
                        onMouseEnter={() => setActiveImage(img)}
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{getProductById(product._id)?.name}</h1>
              <div className='mt-8 flex items-center'>
                <span className='text-orange border-b mr-1'>{product.rating}</span>
                <ProductRating
                  rating={product.rating}
                  activeClassname='fill-orange text-orang w-4 h-4'
                  nonActiveClassname='fill-gray-300 text-gray-300 w-4 h-4'
                />
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Sold</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>${formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>${formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} off
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Quantity</div>
                <QuantityController
                  onType={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-gray-500 text-sm'>{product.quantity} in stock</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='h-12 flex items-center justify-center rounded-sm border-orange border bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                  onClick={addToCart}
                >
                  {' '}
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Add to Cart
                </button>
                <button
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  onClick={buyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg uppercase text-gray-700'>About this item</div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(getProductById(product._id)?.description as string)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>RELATED PRODUCTS</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
