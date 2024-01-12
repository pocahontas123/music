<script>
import { songsCollection} from "@/includes/firebase";
import AppSongItem from "@/components/SongItem.vue";

  export default  {
    name: "HomeView",
    components: {AppSongItem},
    data() {
      return {
        songs: [],//songs en local
        maxPerPage: 25,//maximum de musique par défaut qui s'afficheront
        pendingRequest: false,//ne pas spamer les requêtes
      }
    },
    //à la création
    async created() {
      this.getSongs();

      window.addEventListener("scroll", this.handleScroll);
    },
    //optimisation
    beforeUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
      // offsetHeight => hauteur page entière ;
      // innerHeight => hauteur partie visible page ;
      // scrollTop => distance entre offsetHeight et début de innerHeight
      handleScroll() {
        const { scrollTop, offsetHeight } = document.documentElement;
        const { innerHeight } = window;
        //la partie haute déjà visité + la partie visible === taille total de la page
        //cad que l'on peut afficher une nouvelle musique
        const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;
        console.log("scrolltop "+scrollTop);
        console.log("innerHeight "+innerHeight);
        console.log("offsetHeight "+offsetHeight);
        //const bottomOfWindow = Math.round(scrollTop) + innerHeight > offsetHeight -100;

        if(bottomOfWindow) {
          console.log("bottom of window");
          this.getSongs();
        }
      },
      async getSongs() {
        //gère spam bottom request
        if(this.pendingRequest) {
          return;
        }

        this.pendingRequest = true;

        let snapshots = null;

        //si c'est la première visite, lastdoc ne marchera pas
        if(this.songs.length) {
          //dernier document => correspond à la dernière musique en local (identifiable dans la db par le docID)
          //permettra de remplir 'startAfter'
          const lastDoc = await songsCollection
              .doc(this.songs[this.songs.length - 1].docID)
              .get();

          snapshots = await songsCollection
              .orderBy("modified_name")
              .startAfter(lastDoc)
              //limit – The maximum number of items to return.
              .limit(this.maxPerPage)
              .get();
        }else {
          snapshots = await songsCollection
              .orderBy("modified_name")
              .limit(this.maxPerPage)
              .get();
        }

        snapshots.forEach((document) => {
          this.songs.push(
              {
                docID: document.id,
                //... => les data directement en propriété de l'objet
                ...document.data(),
              }
          );
        });
        //reset for next request
        this.pendingRequest = false;
      },
    },
  };
</script>

<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
          augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <!-- ':song="song"' => 'song' dans 'song in songs' -->
        <app-song-item v-for="song in songs" :key="song.docID" :song="song"></app-song-item>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<style>
  /*
  body {
    overflow-y: scroll;
  }
  */
</style>