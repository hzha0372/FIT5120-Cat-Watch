import { ref } from 'vue'

const AUTH_STORAGE_KEY = 'sunSafety:isAuthenticated'

const isAuthenticated = ref(localStorage.getItem(AUTH_STORAGE_KEY) === 'true')

export const setAuthenticated = (value) => {
  isAuthenticated.value = Boolean(value)
  localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated.value ? 'true' : 'false')
}

export const clearAuthentication = () => {
  setAuthenticated(false)
}

export default isAuthenticated
