import {createStore} from 'vuex'

const store = createStore({
    state () {
        return {
            username: ''
        }
    },
    mutations: {
        setUsername(state, username) {
            state.username = username
        }
    },

    actions: {
    updateUsername({ commit }, username) {
      commit('setUsername', username);
        },
    },
})

export default store;