import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isLogin: false
  }),
  actions: {
    setToken(token) {
      this.token = token
      this.isLogin = true
    },
    clear() {
      this.token = null
      this.isLogin = false
    }
  }
})
