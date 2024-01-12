
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import veeValidatePlugin from './includes/validation';
import { auth } from "./includes/firebase";

import './assets/base.css';
import './assets/main.css';

let app;
/*
    on doit vérifier l'état de l'authentification de l'utilisateur.
    Pour se faire, il faut vérifier avant que la vue charge.
    Si l'utilisateur est déjà connecté, on garde l'application en cours après qu'une page
    ait été rafraichie
 */
auth.onAuthStateChanged(() => {
    if(!app) {
        console.log("app est vide ; création de app")
        app = createApp(App);

        //ajout de deux plugins
        app.use(createPinia());
        app.use(router);
        app.use(veeValidatePlugin, {});

        app.mount('#app');
    }
});



