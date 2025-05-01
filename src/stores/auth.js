import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null, 
    isLogin: false
  }),
  actions: {
    setToken(token) {
      this.token = token
      this.isLogin = true
    },
    setUser(user) {      
      this.user = user
    },
    clear() {
      this.token = null
      this.user = null
      this.isLogin = false
    }
  }
})
