import {createStore} from 'vuex'

const store = createStore({
    state () {
        return {
            username: '',
            record: 0
        }
    },
    mutations: {
        setUsername(state, username) {
            state.username = username
        },

        setRecord(state, record) {
            state.record = Math.max(state.record, record)
        }
    },

    actions: {
        updateUsername({ commit }, username) {
            commit('setUsername', username);
        },

        updateRecord({ commit }, record) {
            commit("setRecord", record)
        }
    },


})

export default store;