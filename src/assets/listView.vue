<template>
    <div id="list-vue">
      <div class="container">
        <div class="row list nomargin">
          <div class="col-md-3">
            <h2>Song</h2>
          </div>
          <div class="col-md-2">
            <h2>Artist</h2>
          </div>
          <div class="col-md-3">
            <h2>Album</h2>
          </div>
          <div class="col-md-2">
            <h2>Popularity</h2>
          </div>
          <div class="col-md-2">
            <h2>Explicit</h2>
          </div>
        </div>
        <div v-for="(track, index) in playlist" :key="index">
        <div class="row list">
          <div class="col-md-3" id="name">
            <p>{{track.name}}</p>
          </div>
          <div class="col-md-2">
            <p>{{track.artists[0].name }}</p>
          </div>
          <div class="col-md-3">
            <p>{{track.album.name}}</p>
          </div>
          <div class="col-md-2">
            <p>{{ track.popularity }} </p>
          </div>
          <div class="col-md-2">
            <p v-if="track.explicit">Explicit</p>
          </div>
        </div>
        </div>
        <div class="row" id="save" v-if="loggedin">
          <div class="col-md-6">
            <input type="text" placeholder="Playlist Name" class="form-control" v-model="playlistName"></div>
          <div class="col-md-6">
            <button type="button" class="btn btn-success btn-block" @click="savePlaylist()">Save</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "list-view",

        props: ['playlist', "user", "loggedin"],

        data() {
          return {
            playlistName: ''
          }
        },

        methods: {
          savePlaylist(){
            //this.myPlaylists.push([this.user.email, this.playlist]);
            this.$emit('save-playlist', {user: this.user.email, playlist: this.playlist, name: this.playlistName});
            this.playlistName= '';
          }
        }
    }
</script>

<style scoped>
.list {
  border-bottom: 1px solid dimgrey;
  margin-top: 1em;
}
.nomargin{
  margin-top: 0em !important;
}
h2 {
  font-size: 1.25em;
  text-align: center;
}
p {
  text-align: center;
  font-size: 0.75em;
}
#save{
  margin-top: 1.5em;
}
</style>
