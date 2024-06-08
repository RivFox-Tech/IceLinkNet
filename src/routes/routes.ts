export const routes = [
    // Menu
    {
        path: "/home",
        component: () => import("../view/home.vue")
    }, {
        path: "/tunnels",
        component: () => import("../view/tunnels.vue")
    }, {
        path: "/plugins",
        component: () => import("../view/plugins.vue")
    }, {
        path: "/logs",
        component: () => import("../view/logs.vue")
    },
    
    // FooterMenu
    {
        path: "/account",
        component: () => import("../view/account.vue")
    }, {
        path: "/settings",
        component: () => import("../view/settings.vue")
    }
]
