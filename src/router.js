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
      path: "/recipe/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/EditRecipe.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: () => import("./views/IngredientList.vue"),
    },
  ],
});

export default router;
