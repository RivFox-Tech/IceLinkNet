import {createApp} from "vue"
import App from "./App.vue"
import naive from "naive-ui"
import {createPinia} from "pinia"
import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes/routes.ts";
import initial from "./services/initial.ts";

const pinia = createPinia()
const app = createApp(App)
const router = createRouter({
    routes,
    history: createWebHistory()
})

initial.file();

app.use(pinia)
app.use(router)
app.use(naive)

app.mount("#app", true)