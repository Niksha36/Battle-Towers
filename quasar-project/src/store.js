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
        },

        setDefault() {
            this.username = ""
            this.record = 0
        }
    },

    actions: {
        updateUsername({ commit }, username) {
            commit('setUsername', username);
        },

        updateRecord({ commit }, record) {
            commit("setRecord", record)
        },

        logout({commit}) {
            commit("setDefault")
        }
    },


})

export default store;
