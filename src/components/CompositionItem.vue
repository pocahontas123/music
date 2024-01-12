<script>
import { songsCollection, storage } from "@/includes/firebase";


export default {
  name: "CompositionItemView",
  data() {
    return {
      showForm: false,

      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false, //disable the submission button (false default => enable)
      show_alert: false, //show/hide alert message
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Updating song info.",
    };
  },
  methods: {
    goback() {
      console.log("go back");
      this.showForm = !this.showForm
      this.show_alert = false;
    },
    //values => contenu du formulaire (param par défaut)
    async edit(values) {
      console.log("edit()");
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Please wait! Updating song info.";
      console.log(values);
      try {
        //this.song => ' :song="song" ' dans Manage au niveau de <CompositionItemView ...
        await songsCollection.doc(this.song.docID).update(values);

      }catch( error ) {
        console.log(error);
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Something went wrong! Try again later.";

        return;
      }

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success!";

      //prévenir le parent
      //this.$emit("song-name-change",this.song.docID, values);
      //index => prop ; this.updateSong => prop
      this.updateSong(this.index, values);

      this.updateUnsavedFlag(false);
    },
    async deleteTheSong() {
      console.log("deleteSong()");
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);
      try {
        await songRef.delete();//supprime dans storage (fichiers ...)
        await songsCollection.doc(this.song.docID).delete();//supprime dans database
        this.deleteSong(this.index);//

      }catch( error ) {
        console.log(error);
      }
    },
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    deleteSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      require: true,
    }
  },
}
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button @click.prevent="deleteTheSong" class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"><i class="fa fa-times"></i></button>
      <button @click.prevent="showForm = !showForm" class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"><i class="fa fa-pencil-alt"></i></button>
    </div>

    <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">
      {{ alert_message }}
    </div>

    <div v-show="showForm">
      <vee-form :validation-schema="schema" @submit="edit" :initial-values="song">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <!-- input détect la modification -->
          <vee-field
              name="modified_name"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter song name"
              @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name"/>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
              name="genre"
              type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              placeholder="Enter Genre"
              @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"/>
        </div>
        <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600"
            :disabled="in_submission"
        >
          Submit
        </button>
        <button
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            :disabled="in_submission"
            @click.prevent="goback()"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<style scoped>

</style>