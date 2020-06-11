import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import { API_CHECKTOKEN } from '@/api/apis.js'


Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../pages/Index'),
        meta: { title: '首页' },
        children: [{
            path: '/index/home',
            name: 'home',
            component: () => import('../pages/index/Home'),
            meta: { title: '首页', role: ['super', 'normal'] }
        },
        {
            path: '/index/orderDetail',
            name: 'orderDetail',
            component: () => import('../pages/index/OrderDetail'),
            meta: { title: '订单管理/订单详情', role: ['super', 'normal'] }
        },
        {
            path: '/index/order',
            name: 'order',
            component: () => import('../pages/index/Order'),
            meta: { title: '订单管理', role: ['super', 'normal'] }
        },
        {
            path: '/index/shops',
            name: 'shops',
            component: () => import('../pages/index/Shops'),
            meta: { title: '商店管理', role: ['super', 'normal'] }
        },
        {
            path: '/index/product/list',
            name: 'productList',
            component: () => import('../pages/index/product/List'),
            meta: { title: '商品管理/商品列表', role: ['super', 'normal'] }
        },
        {
            path: '/index/product/add',
            name: 'productAdd',
            component: () => import('../pages/index/product/Add'),
            meta: { title: '商品管理/商品添加', role: ['super', 'normal'] }
        },
        {
            path: '/index/product/class',
            name: 'productClass',
            component: () => import('../pages/index/product/Class'),
            meta: { title: '商店管理/商品分类', role: ['super', 'normal'] }
        },
        /*----------------------user-------------------------*/
        {
            path: '/index/user/self',
            name: 'userself',
            component: () => import('../pages/index/user/Self'),
            meta: { title: '账号管理/个人中心', role: ['super', 'normal'] }
        },
        {
            path: '/index/user/list',
            name: 'userList',
            component: () => import('../pages/index/user/List'),
            meta: { title: '账号管理/账号列表', role: ['super'] }
        },
        {
            path: '/index/user/add',
            name: 'userAdd',
            component: () => import('../pages/index/user/Add'),
            meta: { title: '账号管理/账号添加', role: ['super'] }
        },
        {
            path: '/index/user/edit',
            name: 'userEdit',
            component: () => import('../pages/index/user/Edit'),
            meta: { title: '账号管理/账号修改', role: ['super'] }
        },
        {
            path: '/index/sales/goods',
            name: 'salesGoods',
            component: () => import('../pages/index/sales/Goods'),
            meta: { title: '销售统计/商品统计', role: ['super'] }
        },
        {
            path: '/index/sales/order',
            name: 'salesOrder',
            component: () => import('../pages/index/sales/Order'),
            meta: { title: '销售统计/订单统计', role: ['super', 'normal'] }
        }]
    },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path != "/") {
        //判断token
        API_CHECKTOKEN({ token: localStorage.token }).then((res) => {
            if (res.data.code == 0) {
                if(to.meta.role.includes(localStorage.role)) {
                    next()
                } else {
                    next(from)
                }
            } else {
                next('/')
            }
        })
    } else {
        next()
    }

})


export default router