<script>
import AppHeader from "@/components/AppHeader.vue"
import AppAuth from "@/components/AppAuth.vue"

import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
//const auth = firebase.auth();//raccourci 1
import { auth } from "./includes/firebase";

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,

  },
  data() {

  },
  computed: {
    //donne accès et permet de modifier 'userLoggedIn'
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
  },
  created() {
    //The currently signed-in user (or null).
    if(auth.currentUser) {
      // cf . mapWritableState
      this.userLoggedIn = true;
    }
  },
};

</script>

<template>
  <!-- Header -->
  <app-header></app-header>

  <router-view></router-view>

  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center">
      <span class="song-title font-bold">Song Title</span> by
      <span class="song-artist">Artist</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button">
        <i class="fa fa-play text-gray-500 text-xl"></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">00:00</div>
      <!-- Scrub Container  -->
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
        <!-- Player Ball -->
        <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" style="left: 50%">
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          style="width: 50%"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">03:06</div>
    </div>
  </div>

  <!-- Auth Modal -->
  <app-auth></app-auth>

</template>

<style scoped></style>