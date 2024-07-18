import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { Category } from 'src/types/categories.type'
import classNames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/utils/rules'
import InputNumber from 'src/components/InputNumber'
import { NoUndefinedField } from 'src/types/utils.type'
import { ObjectSchema } from 'yup'
import RatingStar from 'src/components/RatingStar'
import _, { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ categories, queryConfig }: Props) {
  const categoriesList = [
    { id: '60aba4e24efcc70f8892e1c6', label: 'T-shirts' },
    { id: '60afacca6ef5b902180aacaf', label: 'Watches' },
    { id: '60afafe76ef5b902180aacb5', label: 'Cellphones' }
  ]
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>),
    shouldFocusError: false
  })

  const navigate = useNavigate()

  const valueForm = watch()
  console.log(valueForm)
  console.log(errors)

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const resetFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['category', 'price_max', 'price_min', 'rating_filter'])).toString()
    })
  }

  const getLabelById = (id: string) => {
    const category = _.find(categoriesList, { id })
    return category ? category.label : null
  }

  const { category } = queryConfig
  return (
    <div className='py-4'>
      <Link to={path.home} className={classNames('flex items-center', { 'text-orange font-bold': !category })}>
        <svg viewBox='0 0 12 10' className='w-3 h-4 mr-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        All categories
      </Link>
      <div className='bg-gray-300 my-4 h-[1px]'></div>
      <ul>
        {categories.map((categoryItem) => (
          <li key={categoryItem._id} className='py-2 pl-2'>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('relative px-2', {
                'text-orange  font-semibold': categoryItem._id === category
              })}
            >
              {categoryItem._id === category && (
                <svg viewBox='0 0 4 7' className='h-2 w-2 absolute top-1 left-[-10px] fill-orange'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {getLabelById(categoryItem._id)}
            </Link>
          </li>
        ))}
      </ul>
      <Link to={path.home} className='flex items-center font-bold mt-4'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='w-3 h-4 mr-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Filters
      </Link>
      <div className='bg-gray-300 my-4 h-[1px]'></div>
      <div className='my-5'>
        <div>Price Range</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='$ FROM'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='$ TO'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>
          <Button className='w-full p-2 uppercase bg-orange text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
            Apply
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 my-4 h-[1px]'></div>
      <div className='text-sm'>Review</div>
      <ul className='my-3'>
        <RatingStar queryConfig={queryConfig} />
      </ul>
      <div className='bg-gray-300 my-4 h-[1px]'></div>
      <Button className='w-full py-2 px-2 uppercase bg-orange text-white text-sm' onClick={resetFilter}>
        Reset
      </Button>
    </div>
  )
}
