import {createApp} from "vue"
import App from "./App.vue"
import naive from "naive-ui"
import {createWebHistory, createRouter} from "vue-router";
import {routes} from "./routes/routes.ts";

const app = createApp(App)
const router = createRouter({
    routes,
    history: createWebHistory()
})

app.use(router)
app.use(naive)

app.mount("#app", true)