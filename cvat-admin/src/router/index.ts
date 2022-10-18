import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import Login from "../components/views/Login.vue";
import frame from "../components/frame/Frame.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
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
      path: "/road",
      component: frame,
      name: "road",
      redirect: "/road/index",
      children: [
        {
          path: "index",
          name: "roadIndex",
          component: () => import("../components/road/List.vue"),
          // breadcrumb: false,
        },
        {
          path: "new",
          name: "roadNew",
          component: () => import("../components/road/New.vue"),
          // breadcrumb: false,
        },
        {
          path: "edit/:id",
          name: "roadEdit",
          component: () => import("../components/road/New.vue"),
          // breadcrumb: false,
        },
        {
          path: "stationlist/:id",
          name: "projectStationList",
          component: () => import("../components/road/TaskList.vue"),
          // breadcrumb: false,
        },
        {
          path: "station/:id",
          name: "stationNew",
          component: () => import("../components/task/New.vue"),
          // breadcrumb: false,
        },
      ],
    },
    {
      // task management
      path: "/task",
      component: frame,
      name: "task",
      redirect: "/task/index",
      children: [
        {
          path: "index",
          name: "taskIndex",
          component: () => import("../components/task/List.vue"),
        },
      ],
    },
    {
      // task management
      path: "/template",
      component: frame,
      name: "template",
      redirect: "/template/index",
      children: [
        {
          path: "index",
          name: "templateIndex",
          component: () => import("../components/template/List.vue"),
        },
      ],
    },
    {
      // person management
      path: "/person",
      component: frame,
      name: "person",
      redirect: "/person/index",
      children: [
        {
          path: "index",
          name: "personIndex",
          component: () => import("../components/person/List.vue"),
          // breadcrumb: false,
        },
        {
          path: "Create",
          name: "personCreate",
          component: () => import("../components/person/Create.vue"),
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
