<template>
  <div id="my-playlists">
    <div class="container">
      <div class="row center">
        <div class="col-md-12" id="title">
          <p>{{ msg }} </p>
        </div>
      </div>
      <div v-for="pl in playlistList" :key="pl.id" @click="select(pl)">
        <div class="row">
          <div class="col-md-12 center">
            <p>{{pl.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "my-playlists",
        props: ['playlist-list', 'user'],
        methods: {
          select(playlist){
            this.$emit('select-playlist', playlist)
          }
        },
      computed: {
          msg() {
            return this.user ? "My Playlists" : "View an Existing Playlist"
          }
      }
    }
</script>

<style scoped>
  .center{
    text-align: center;
    font-size: 1.25em;
  }
  #title{
    margin-top: 1em;
  }
</style>
