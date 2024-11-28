const routes = [
    {path: '/', redirect: () => '/register'},
    {path: '/game', component: () => import('components/Game.vue')},
    {path: '/register', component: () => import('components/RegistrationForm.vue')},
    {path: '/login', component: () => import('components/LoginForm.vue')},


    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
