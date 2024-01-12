<script>
//import useUserStore from "@/stores/user";
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth } from "@/includes/firebase";
import CompositionItemView from "@/components/CompositionItem.vue";


export default  {
    name: "manageView",
    components: {CompositionItemView, AppUpload},
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
      /*
        fieldPath – The path to compare
        opStr – The operation string (e.g "<", "<=", "==", ">", ">=").
        value – The value for comparison
       */
      //récupérer le contenu dans "firestore database" dans firebase
      //où l'UID match celui de l'utilisateur connecté à l'application
      //get => Executes the query and returns the results as a QuerySnapshot.
      const snapshotQuery = await songsCollection.where("uid", "==", auth.currentUser.uid).get();
      //document <=> song dans songs
      snapshotQuery.forEach(this.addSong);

    },
    methods: {
      updateSong(i, values) {
        console.log("updateSong");
        console.log("i "+i);
        console.log("value "+values);

        /*
        this.songs.forEach( (song) => {
          if(song.docID == i) {
            song.modified_name = values.modified_name;
            song.genre = values.genre;
            console.log("done");
          }
        });*/
        this.songs[i].modified_name = values.modified_name;
        this.songs[i].genre = values.genre;

      },
      deleteSong(index) {
        this.songs.splice(index, 1);
      },
      //accessible depuis l'enfant à la suite de l'ajout (upload) d'une music
      addSong(document) {
        const song = {
          //C'est une façon concise de copier les propriétés d'un objet dans un nouvel objet.
          ...document.data(),
          docID: document.id,
        }
        this.songs.push(song);
      },
      updateUnsavedFlag(bool) {
        this.unsavedFlag = bool;
      },
    },
    beforeRouteLeave(to, from, next) {
      //no unsaved change => on continue
      if (!this.unsavedFlag) {
        next();
      } else {
        // eslint-disable-next-line no-alert, no-restricted-globals
        const leave = confirm(
            "You have unsaved changes. Are you sure you want to leave?"
        );
        next(leave);
      }
    },
    /*
    beforeRouteLeave(to, from, next) {
      const ref = this.$refs.upload;
      ref.cancelUploads();
      next();
    },
     */
    /*
    beforeRouteEnter(to, from, next) {
      //accéde au store dans un guard
      const store = useUserStore();

      if(store.userLoggedIn) {
        console.log('est connecté !');
        next();

      }else {
        console.log('n est pas connecté ! redirection / ');
        next( { name: "home" } );
      }

      console.log("beforeRouteEnter Guard");
    },

     */

  };
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">

        <!-- Donne un accès au parent dans le component enfant -->
        <app-upload ref="upload" :addSong="addSong"></app-upload>

      </div>
      <div class="col-span-2">
        <div
            class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
                class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- On récupère l'index en prop qui servira pour updateSong dans CompositionItem -->
            <!-- "songs" pas non pas "this.songs" -->
            <CompositionItemView v-for="(song, index) in songs"
                                 :key="song.docID"
                                 :song="song"
                                 :updateSong="updateSong"
                                 :index="index"
                                 :deleteSong="deleteSong"
                                 :addSong="addSong"
                                 :updateUnsavedFlag="updateUnsavedFlag"
            >
            </CompositionItemView>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>

</style>