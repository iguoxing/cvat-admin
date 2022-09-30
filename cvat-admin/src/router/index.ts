import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/views/Login.vue";
import frame from "../components/frame/Frame.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/home",
      component: frame,
      name: "home",
      redirect: "/home/index",
      children: [
        {
          path: "index",
          name: "homeIndex",
          component: () => import("../components/frame/HomeView.vue"),
          // breadcrumb: false,
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
