<script>
import { mapStores, mapActions } from "pinia";
import useModalStore from "@/stores/modal";
import useUserStore from "@/stores/user";
export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore, useUserStore),
  },
  components: {
  },
  data() {

  },
  methods: {
    /*
    ...mapActions(useUserStore, {
      signOut: "signOut",
    }),
     */
    //...mapWritableState(useUserStore, ["userLoggedIn"]),
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen)
    },
    signOut() {
      //appel le signOut du store
      this.userStore.signOut();
      console.log(this.$route);

      //applique une redirection uniquement si la page en cours est 'manage'
      //qui est accessible uniquement si on est connecté

      //accède à une propriété 'meta' d'une route
      //ce sont des prop personnalisées
      //ici, on a ajouté requiresAuth aux routes qui ont besoin d'une co
      if(this.$route.meta.requiresAuth) {
        //ajoute une redirection
        this.$router.push({name: 'home'});
      }
    },
  },
};
</script>

<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
          class="text-white font-bold uppercase text-2xl mr-4"
          :to="{ name:'home' }"
          exact-active-class="no-active"
      >
        Music
      </router-link>
      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">About</router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">Login / Register</a>
          </li>
          <!-- pas besoin de "this" ici -->
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" @click.prevent="signOut" href="#">Logout</a>
            </li>
          </template>
        </ul>
      </div>

    </nav>
  </header>
</template>

<style scoped>

</style>