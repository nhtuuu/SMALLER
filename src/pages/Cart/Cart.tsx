import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import _, { keyBy } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchasesApi from 'src/apis/purchases.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/types/purchases.type'
import { formatCurrency, createURL } from 'src/utils/utils'
import noproduct from 'src/assets/images/no-product.png'
import { Helmet } from 'react-helmet-async'
import productInfo from 'src/constants/productInfo'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchasesApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const location = useLocation()
  const purchaseId = (location.state as { purchaseId: string } | null)?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          return {
            ...purchase,
            disabled: false,
            checked: purchase._id === purchaseId || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, purchaseId, setExtendedPurchases])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const updatePurchaseMutation = useMutation({
    mutationFn: purchasesApi.updatePurchases,
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: purchasesApi.deletePurchases,
    onSuccess: () => {
      refetch()
    }
  })

  const buyPurchaseMutation = useMutation({
    mutationFn: purchasesApi.buyProducts,
    onSuccess: () => {
      refetch()
    }
  })

  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked) && extendedPurchases.length > 0,
    [extendedPurchases]
  )
  const isChecked = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const totalAmount = useMemo(
    () => isChecked.reduce((totalAmount, purchase) => totalAmount + purchase.price * purchase.buy_count, 0),
    [isChecked]
  )
  const totalDiscountAmount = useMemo(
    () =>
      isChecked.reduce(
        (totalAmount, purchase) => totalAmount + (purchase.price_before_discount - purchase.price) * purchase.buy_count,
        0
      ),
    [isChecked]
  )
  const totalQty = useMemo(
    () => isChecked.reduce((totalQty, purchase) => totalQty + purchase.buy_count, 0),
    [isChecked]
  )

  const handleChecked = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedPurchases((prev) => {
      return prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    })
  }

  const handleDeletePurchases = (purchaseIndex: number) => () => {
    const purchase = extendedPurchases[purchaseIndex]
    deletePurchaseMutation.mutate([purchase._id])
  }

  const handleDeleteManyPurchases = () => {
    const purchasesIDs = isChecked.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchasesIDs)
  }

  const handleBuyProducts = () => {
    const body = isChecked.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }))
    buyPurchaseMutation.mutate(body)
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )

      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const getProductById = (id: string) => {
    const productDetail = _.find(productInfo, { id })
    return productDetail ? productDetail : null
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <Helmet>
        <title>CART | SMALLER</title>
        <meta name='description' content='CART | SMALLER' />
      </Helmet>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          onChange={handleCheckAll}
                          checked={isAllChecked}
                        />
                      </div>
                      <div className='flex-grow text-black'>Product</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Price</div>
                      <div className='col-span-1'>Quantity</div>
                      <div className='col-span-1'>Sub total</div>
                      <div className='col-span-1'>Action</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases.map((purchase, index) => (
                    <div
                      key={purchase._id}
                      className='mb-5 grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0 items-center'
                    >
                      <div className='col-span-6'>
                        <div className='flex'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className='h-5 w-5 accent-orange'
                              onChange={handleChecked(index)}
                              checked={purchase.checked}
                            />
                          </div>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <Link
                                className='h-20 w-20 flex-shrink-0'
                                to={`${path.home}${createURL({
                                  name: getProductById(purchase.product._id)?.name as string,
                                  id: purchase.product._id
                                })}`}
                              >
                                <img alt={purchase.product.name} src={purchase.product.image} />
                              </Link>
                              <div className='flex-grow px-2 pt-1 pb-2'>
                                <Link
                                  to={`${path.home}${createURL({
                                    name: getProductById(purchase.product._id)?.name as string,
                                    id: purchase.product._id
                                  })}`}
                                  className='line-clamp-2 text-left'
                                >
                                  {getProductById(purchase.product._id)?.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6'>
                        <div className='grid grid-cols-5 items-center'>
                          <div className='col-span-2'>
                            <div className='flex items-center justify-center'>
                              <span className='text-gray-300 line-through'>
                                ${formatCurrency(purchase.product.price_before_discount)}
                              </span>
                              <span className='ml-3'>${formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                          <div className='col-span-1'>
                            <QuantityController
                              max={purchase.product.quantity}
                              value={purchase.buy_count}
                              classNameWrapper='flex items-center'
                              onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                              onDecrease={(value) => handleQuantity(index, value, true)}
                              onType={handleTypeQuantity(index)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value <= purchase.product.quantity &&
                                    value >= 1 &&
                                    value !== (purchasesInCart as Purchase[])[index].buy_count
                                )
                              }
                              disabled={purchase.disabled}
                            />
                          </div>
                          <div className='col-span-1'>
                            <span className='text-orange'>
                              ${formatCurrency(purchase.product.price * purchase.buy_count)}
                            </span>
                          </div>
                          <div className='col-span-1'>
                            <button
                              className='bg-none text-black transition-colors hover:text-orange'
                              onClick={handleDeletePurchases(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
                  Select all ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  Delete
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Total ({totalQty} items):</div>
                    <div className='ml-2 text-2xl text-orange'>${formatCurrency(totalAmount)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Savings</div>
                    <div className='ml-6 text-orange'>${formatCurrency(totalDiscountAmount)}</div>
                  </div>
                </div>
                <Button
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                  onClick={handleBuyProducts}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='bg-gray-100'>
            <div className='text-center'>
              <div className='pt-20'>
                <img src={noproduct} alt='no-items' className='h-24 w-24 mx-auto' />
                <div className='font-bold mt-5 text-gray-600 text-center'>Your Cart is Empty</div>
                <div className='mt-5'>
                  <Link
                    to={path.home}
                    className='px-6 py-2 rounded-sm bg-orange uppercase text-white shadow-sm outline-none hover:bg-orange/90'
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
