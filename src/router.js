import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/",
      name: "signup",
      component: () => import("./views/SignUp.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/createitinerary",
      name: "createitinerary",
      component: () => import("./views/CreateItinerary.vue"),
    },
    {
      path: "/createhotel",
      name: "createhotel",
      component: () => import("./views/CreateHotel.vue"),
    },
    {
      path: "/edititinerary/:id",
      name: "edititinerary",
      component: () => import("./views/EditItinerary.vue"),
    },
    {
      path: "/edithotel/:id",
      name: "edithotel",
      component: () => import("./views/EditHotel.vue"),
    },
    {
      path: "/viewhotels",
      name: "viewhotels",
      component: () => import("./views/ViewHotels.vue"),
    },
    {
      path: "/createsite",
      name: "createsite",
      component: () => import("./views/CreateSite.vue"),
    },
    {
      path: "/editsite/:id",
      name: "editsite",
      component: () => import("./views/EditSite.vue"),
    },
    {
      path: "/viewsites",
      name: "viewsites",
      component: () => import("./views/ViewSites.vue"),
    },
  ],
});

export default router;
