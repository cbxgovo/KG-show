import { createRouter,createWebHistory} from 'vue-router';
 
const router = createRouter({
    routes: [
        {
            path: '/home',             
                 //路由到的地址(自定义)
            component:()=>import('../views/Home.vue'), 
                 //引入组件，组件Home.vue所在路径
                 //Home.vue是需要路由的vue组件
            name: 'Home'
                 //组件名称
        },
        {
          path: '/community',             
               //路由到的地址(自定义)
          component:()=>import('../views/community.vue'), 
               //引入组件，组件Home.vue所在路径
               //Home.vue是需要路由的vue组件
          name: 'community'
               //组件名称
        },
        {
            path: '/',             
                 //路由到的地址(自定义)
            component:()=>import('../views/KG.vue'), 
                 //引入组件，组件Home.vue所在路径
                 //Home.vue是需要路由的vue组件
            name: 'KG'
                 //组件名称
        }, 
        {
          path: '/communityNetwork',             
               //路由到的地址(自定义)
          component:()=>import('../views/communityNetwork.vue'), 
               //引入组件，组件Home.vue所在路径
               //Home.vue是需要路由的vue组件
          name: 'communityNetwork'
               //组件名称
        }, 
        {
          path: '/communityHeatmap',             
               //路由到的地址(自定义)
          component:()=>import('../views/communityHeatmap.vue'), 
               //引入组件，组件Home.vue所在路径
               //Home.vue是需要路由的vue组件
          name: 'communityHeatmap'
               //组件名称
        }, 
    ],
    history: createWebHistory()
})
export default router;