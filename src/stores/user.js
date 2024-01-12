import {defineStore} from "pinia";
import {auth, usersCollection} from "@/includes/firebase.js";


export default defineStore("user", {
    state: () => ({
        userLoggedIn: false,
    }),
    //
    actions: {
        async register(values) {
            //récupère un token et l'enregistre automatiquement (localstorage)
            const userCred = await auth.createUserWithEmailAndPassword(
                values.email, values.password,
            );

            //ajoute les informations de notre nouvel utilisateur dans la collection 'users'
            //Collection (users) => 1 document/objet (name, email, age et country)
            //envoi automatiquement le token local

            /*
                par défaut, il n'y a pas de lien entre l'utilisateur et ses données.
                Lors de la création du document (objet), il possède un UID généré.
                Pour avoir un lien,on lui assignera le même UID que celui de l'utilisateur
             */
            await usersCollection.doc(userCred.user.uid).set({
                            name: values.name,
                            email: values.email,
                            age: values.age,
                            country: values.country,
                        }
            );
            //profile – The profile's displayName and photoURL to update.
            await userCred.user.updateProfile({
                displayName: values.name,
                //photoURL:
            });

            this.userLoggedIn = true;
        },
        async authenticate(values) {
            await auth.signInWithEmailAndPassword(
                values.email, values.password,
            );

            //s'exécute si await ne plante pas
            this.userLoggedIn = true;
            console.log("authenticate : "+this.userLoggedIn);
        },
        async signOut() {
            console.log("signOut");
            await auth.signOut();

            this.userLoggedIn = false;
            console.log("signOut2 : "+this.userLoggedIn);
        },
    },
    getters: {
        x(state) {
            return "";
        },
    },
    setter: {
        userIsLogged(state) {
            return state.userLoggedIn;
        }
    },

});