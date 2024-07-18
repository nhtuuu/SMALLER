import { User } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLocalStorageEvent = new Event('clearLocalStorage')
  localStorageEventTarget.dispatchEvent(clearLocalStorageEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('accessToken') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
