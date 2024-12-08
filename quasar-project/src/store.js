import {createStore} from 'vuex'

const store = createStore({
    state () {
        return {
            username: '',
            record: 0,
            time: 0,
            isMenuMusicPlaying: false
        }
    },
    mutations: {
        setUsername(state, username) {
            state.username = username
        },

        setRecord(state, record) {
            state.record = Math.max(state.record, record)
        },

        setIsPlaying(state, isPlaying) {
            state.isMenuMusicPlaying = isPlaying
        },
        setTime(state, time) {
            state.time = time
        },

        setDefault(state) {
            state.username = ""
            state.record = 0
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
        },
        updateMusicState({ commit }, data) {
            commit("setIsPlaying", data.isPlaying)
            commit("setTime", data.currentTime)
        }
    },


})

export default store;
