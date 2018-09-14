import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router=new Router({
  routes: [
    { 
      path: '/', 
      name: 'home',
      component: resolve=> require (['@/components/home/home.component'],resolve)
    },
    {
       path: '/slash',
        name: 'slash',
        component: resolve=> require (['@/components/slash/slash.component'],resolve)
      },
    { path: '/create' , name: 'create', 
    component: resolve=> require (['@/components/create/create.component'],resolve)
   },
    { path: '/download' , name: 'download', 
    component: resolve=> require (['@/components/download/download.component'],resolve)
  },
    { path: '/wallet' , name: 'wallet', 
    component: resolve=> require (['@/components/wallet/wallet.component'],resolve)
  },
    { path: '/send' , name: 'send', 
    component: resolve=> require (['@/components/send/send.component'],resolve)
  },
    { path: '/recv' , name: 'recv',
    component: resolve=> require (['@/components/recv/recv.component'],resolve)
    },
    { path: '/keyimport' , name: 'keyimport', 
    component: resolve=> require (['@/components/keyImport/keyImport.component'],resolve)
  },
  { path: '/iosDownload', 
    component: resolve=> require (['@/components/iosDownload/iosDownload'],resolve)
  },
  ]
})
export default router
