import game from '../components/Game.vue'
import register from '../components/RegistrationForm.vue'
import login from '../components/LoginForm.vue'

const routes = [
    {path: '/', redirect: () => '/game'},
    {path: '/game', component: game},
    {path: '/register', component: register},
    {path: '/login', component: login},
]

export default routes
