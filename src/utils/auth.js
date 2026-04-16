const AUTH_KEY = 'catwatch_auth'

const normalize = (value) => String(value || '').trim().toLowerCase()

export const credentialsMatch = (username, password) => {
  return normalize(username) === 'daniel' && normalize(password) === 'simba'
}

export const isAuthenticated = () => {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export const login = () => {
  sessionStorage.setItem(AUTH_KEY, '1')
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY)
}
