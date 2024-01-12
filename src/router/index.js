import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import Manage from "@/views/Manage.vue";
import useUserStore from "@/stores/user"

const routes = [
  //
  {
    name: "home",//update l'url
    path: "/",
    //Introduction
    //Main Content -->
    component: HomeView,
  },
  {
    name: "about",
    path: "/about",
    component: AboutView,
  },
  {
    name: "manage",
    path: "/manage-music",
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log("Manage Route Guard");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "/manage" },
  },
    //sera vérifier automatiquement à la fin par défaut
    //si un lien n'existe pas => redirection vers "home"
  {
    path: '/:catchAll(.*)*',
    redirect: { name: "home" },
  },
];

const router = createRouter({
  //API History : possibilité offerte par les browsers afin de modifier l'url en cours sans rafraichir la page
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",

});

router.beforeEach((to, from, next) => {
  console.log("Global Duard");
  console.log(to.meta);

  //S'il n'y a pas de prop 'requiresAuth' alors on affiche la page suivante
  //cela ne sert à rien de faire autre chose car l'utilisateur n'a pas besoin d'être
  //authentifier pour voir la page
  if( !to.meta.requiresAuth ) {
    next();
    return;
  }

  const store = useUserStore();
  //par contre s'il a besoin d'être authentifier, il y aura deux scénarios : co ou pas
  //si l'utilisateur est connecté
  if(store.userLoggedIn) {
    next();

    //sinon redirection vers home
  }else {
    next( { name: "home" } );
  }

});

export default router
