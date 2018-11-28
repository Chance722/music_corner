import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'mint-ui'
const IndexView = (resolve) => require(['@/views/IndexView'], resolve)
const LoginView = (resolve) => require(['@/views/LoginView'], resolve)
const RegistView = (resolve) => require(['@/views/RegistView'], resolve)
const InfoView = (resolve) => require(['@/views/InfoView'], resolve)
const PageView = (resolve) => require(['@/views/PageView'], resolve)
const EditView = (resolve) => require(['@/views/EditView'], resolve)

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/pages/'
    },
    {
      path: '/pages',
      component: PageView,
      children: [
        {
          path: '',
          redirect: '/pages/index'
        },
        {
          path: 'index',
          name: 'index',
          component: IndexView
        },
        {
          path: 'info',
          name: 'info',
          component: InfoView
        },
        {
          path: 'edit',
          name: 'edit',
          component: EditView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/regist',
      name: 'regist',
      component: RegistView
    }
  ]
})


router.beforeEach((to, from, next) => {

   if (to.matched.some(res => res.meta.requireAuth)) {
      let userToken = localStorage.getItem('userToken')
      if (userToken) {
        next()
      } else {
        next({
          name: 'login'
        })
      }
   } else {
      next();
   }
})



export default router
