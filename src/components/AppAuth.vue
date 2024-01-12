<script>
import useModalStore from "@/stores/modal";
import {mapState, mapWritableState} from "pinia";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";
export default {
  name: "AppAuth",
  computed: {
    //me permet d'accéder aux getters (hiddenClass de Modal.js) (store)
    //et au state sans pouvoir modifier un état (state)
    ...mapState(useModalStore, ["hiddenClass"]),
    //Donne accès aux states et permet de mes modifiers
    //...mapWritableState(useModalStore, ["isOpen"]),
    ...mapWritableState(useModalStore, {
      //alias
      modalVisibility : "isOpen"
    }),
    //...mapStore(useModalStore),
  },
  components: {
    RegisterForm,
    LoginForm
  },
  data() {
    return {
      tab: "login",

    };
  },
  methods: {
  },
};
</script>

<template>
  <!-- la classe se gère toute seule de manière dynamique grâce au cache -->
  <!-- L'utilisateur change 'isOpen' en True ou False. Et hiddenClass se règle automatiquement par rapport à isOpen -->
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <!-- Modal Close Button -->
            <!--<div class="modal-close cursor-pointer z-50" @click.prevent="this.isOpen = !this.isOpen">-->
            <!-- Utilise un Alias -->
            <div class="modal-close cursor-pointer z-50" @click.prevent="modalVisibility = false">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <!-- text-white => color: blanc ; hover:text-white : text blanc au survol au lieu du jaune par défaut  -->
              <!-- bg-blue-600 : background-color blue de type 600 (background-color: rgb(37 99 235);) -->
              <a
                  class="block rounded py-3 px-4 transition"
                  href="#"
                  @click.prevent="tab = 'login'"
                  :class="{ 'hover:text-white text-white bg-blue-600': tab === 'login',
                            'hover:text-blue-600' : tab ===  'register'
                  }"
              >Login</a>
            </li>
            <li class="flex-auto text-center">
              <a
                  class="block rounded py-3 px-4 transition"
                  href="#"
                  @click.prevent="tab = 'register'"
                  :class="{ 'hover:text-white text-white bg-blue-600': tab === 'register',
                            'hover:text-blue-600' : tab ===  'login'
                  }"
              >Register</a>
            </li>
          </ul>

          <!-- Login Form -->
          <login-form v-if="tab === 'login'"></login-form>
          <!-- Registration Form -->
          <register-form v-else></register-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>