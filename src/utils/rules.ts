import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Need an email address!'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Invalid format!'
    },
    maxLength: {
      value: 160,
      message: 'Must be 5 to 160 words'
    },
    minLength: {
      value: 5,
      message: 'Must be 5 to 160 words'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Need a password!'
    },
    maxLength: {
      value: 160,
      message: 'Must be 6 to 160 words'
    },
    minLength: {
      value: 6,
      message: 'Must be 6 to 160 words'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Need password confirmation!'
    },
    maxLength: {
      value: 160,
      message: 'Must be 6 to 160 words'
    },
    minLength: {
      value: 6,
      message: 'Must be 6 to 160 words'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Password does not match!'
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Invalid input')
    .min(6, 'Must be 6 to 160 words')
    .max(160, 'Must be 5 to 160 words')
    .oneOf([yup.ref(refString)], 'Password does not match')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Invalid input!')
    .email('Invalid format!')
    .min(5, 'Must be 5 to 160 words')
    .max(160, 'Must be 5 to 160 words'),
  password: yup.string().required('Invalid input!').min(6, 'Must be 6 to 160 words').max(160, 'Must be 5 to 160 words'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Invalid price range',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Invalid price range',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Max length is 160 characters').trim(),
  phone: yup.string().max(20, 'Max length is 20 digits').trim(),
  address: yup.string().max(160, 'Max length is 160 characters').trim(),
  date_of_birth: yup.date().max(new Date(), 'Invalid Date'),
  avatar: yup.string().max(1000),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >
})

const loginSchema = schema.omit(['confirm_password'])

export type UserSchema = yup.InferType<typeof userSchema>
export type loginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>
