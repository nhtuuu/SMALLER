import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Schema, schema } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const handleSearchSubmit = handleSubmit((data) => {
    const check = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['sort_by']
        )
      : { ...queryConfig, name: data.name }
    navigate({
      pathname: path.home,
      search: createSearchParams(check).toString()
    })
    reset()
  })
  return { handleSearchSubmit, register }
}
