<script>
import { storage, auth, songsCollection } from '@/includes/firebase'
export default {
  name: 'UploadView',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  props: ["addSong"],
  methods: {
    upload($event) {
      this.is_dragover = false
      console.log($event);
      //transforme un objet javascript en tableau
      //The files property of DataTransfer objects is a
      //list of the files in the drag operation.
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file /*, index, array*/) => {
        if (file.type !== 'audio/mpeg') {
          return
        }
        //(permet de savoir ou uploader le file
        const storageRef = storage.ref() //music-1d2e3.appspot.com
        //music-1d2e3.appspot.com/songs/nom-fichier.jpeg
        const songsRef = storageRef.child(`songs/${file.name}`)

        //put() initialise l'upload du fichier
        //Returns: An object that can be used to monitor and manage the upload firebase
        const task = songsRef.put(file)

        //sauvegarde le fichier en cours d'upload dans un tableau.
        //Chaque entrée du tableau contiendra ces trois propriétés
        //on récupère l'index de l'élément du tableau
        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: ''
          }) - 1

        //Chacun de mes fichiers en cours d'upload change d'état (progressed, canceled ou successfull)
        //snapshot => Holds data about the current state of the upload task.
        task.on(
          'state_changed',
          (snapshot) => {
            //pourcentage of the upload already done
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            //à partir de l'index, on peut maintenant trouver et mettre à jour la prop
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            console.log(error)

            //async /!\ avec getDownloadURL
          },
          async (complet) => {
            //génère un objet 'song' qui sera stocker en parallèle de mon fichier, dans un bucket 'songs'
            const song = {
              uid: auth.currentUser.uid, //who uploaded the file ?
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }
            //pas sûr
            song.url = await task.snapshot.ref.getDownloadURL()
            //ajoute la song à la collection song
            //A Promise resolved with a DocumentReference pointing to the newly
            // created document after it has been written to the backend
            const songRef = await songsCollection.add(song)
            const songSnapshot = await songRef.get();
            //accès fonction component parent
            this.addSong(songSnapshot);

            this.uploads[uploadIndex].current_progress = 100
            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'
            console.log(complet)
          }
        )
      })

      console.log(files)
    },
    /*
    cancelUploads() {
      this.uploads.forEach((file) => {
        //FirebaseError: Firebase Storage: User canceled the upload/download. (storage/canceled)
        file.task.cancel();
        console.log("canceled upload")
      });
    },
     */
  },
  beforeUnmount() {
    this.uploads.forEach((file ) => {
      //FirebaseError: Firebase Storage: User canceled the upload/download. (storage/canceled)
      file.task.cancel();
    });

  },

}
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <!--
        1 - quand l'élément est "dragged" (tant que l'utilisateur déplace un élément avec son curseur)
        2 - quand l'élément commence à être dragged (1ère étape de la vie de 'drag')
        3 - quand l'élément est laché (undragged) (dernière étape de al vie de 'drag')
        4 - quand l'élément est "dragged" au-dessus d'une zone de largage (équivalent de 'drag', cat en continue)
        5 - quand un élément dragged vient d'entrer dans une zone de largage (équiv de dragstart)
        6 - élément dragged qui quitte la zone de largage (équiv de dragend)
        7 - quand l'élément dragged est lâché sur la zone de largage

        /!\
        -
      -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>

      <input type="file" multiple @change="upload($event)" />

      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>