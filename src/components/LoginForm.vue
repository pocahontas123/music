<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

  export default {
    name:"LoginForm",
    data() {
      return {
        loginSchema: {
          email: "required|min:3|max:100|email",
          password: "required|min:9|max:100|excluded:password",
        },
        log_in_submission: false,
        log_show_alert: false,
        log_alert_variant: "bg-blue-500",//Attente couleur
        log_alert_msg: "Please wait! Your account is being created.",//Attente message
      }
    },
    methods: {
      ...mapActions(useUserStore, ["authenticate"]),
      async login(values) {
        this.log_show_alert = true;
        this.log_in_submission = true;
        this.log_alert_variant = "bg-blue-500";
        this.log_alert_msg  = "Please wait! We are logging you in !";

        try {
          await this.authenticate(values);

          //si l'authentification foire
        }catch( error ) {
          this.log_in_submission = false;
          this.log_alert_variant = "bg-red-500";
          this.log_alert_msg = "Invalid login details.";
          return
        }

        this.log_alert_variant = "bg-green-500";
        this.log_alert_msg = "Success! You're now logged in.";

        //refresh la page
        window.location.reload();
      },
    },
  }

</script>

<template>
  <div class="text-white text-center font-bold p-4 rounded mb-4"
       v-if="log_show_alert"
       :class="log_alert_variant">
    {{ log_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email"/>
    </div>
    <!-- Password -->
    <div class="mb-3" >
      <label class="inline-block mb-2">Password</label>
      <vee-field
          name="password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password"/>
    </div>
    <button
        :disabled="log_in_submission"
        type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<style scoped>

</style>