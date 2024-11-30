import game from '../components/Game.vue'
import register from '../components/RegistrationForm.vue'
import login from '../components/LoginForm.vue'
import menu from '../components/GameMenu.vue'
import rating from '../components/RatingsComponent.vue'
const routes = [
    {path: '/', redirect: () => '/menu'},
    {path: '/game', component: game},
    {path: '/register', component: register},
    {path: '/login', component: login},
    {path: '/menu', component: menu},
    {path: '/rating', component: rating}
]

export default routes
