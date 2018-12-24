import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '../../store'
import router from '../../router'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    role: '',
    menus: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, userInfo) => {
      state.id = userInfo.id
      state.name = userInfo.name
      state.avatar = userInfo.avatar
      state.role = userInfo.role
      state.menus = userInfo.menus
      state.permissions = userInfo.permissions
    },
    RESET_USER: (state) => {
      state.id = null
      state.name = ''
      state.avatar = ''
      state.role = ''
      state.menus = []
      state.permissions = []
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data) {
            commit('SET_USER', data)
            // 生成路由
            store.dispatch('GenerateRoutes', { role: data.role, menus: data.menus }).then(() => {
              // 生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
              router.addRoutes(store.getters.addRouters)
            })
          } else {
            reject('getInfo: error !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('RESET_USER')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('RESET_USER')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
