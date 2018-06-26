<template>
    <div id="list-vue">
      <div class="container">
        <div v-for="(sublist, sublistIndex) in sublists" :key="sublistIndex" class="row">
            <div class="col-md-1"></div>
            <div v-for="(track, index) in sublists[sublistIndex]" :key="index" class="col-md-2">
                <div class="album" @click="hover(index, sublistIndex)">
                    <img :src="track.album.images[0].url" alt="" class="albumcover" :class="{'overlay' : toggleHover && index == hoverIndex && sublistIndex == hoverSL }">
                    <div class="info" :style="hoverDisplay(index, sublistIndex)">
                        <p>{{track.name}}</p>
                        <p>{{track.artists[0].name}}</p>
                        <p>{{track.album.name}}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-1"></div>
        </div>
        <div class="row" id="save" v-if="loggedin">
            <div class="col-md-6">
                <input type="text" placeholder="Playlist Name" class="form-control" v-model="playlistName">
            </div>
            <div class="col-md-6">
                <button type="button" class="btn btn-success btn-block" @click="savePlaylist()">Save</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "grid-view",
        props: ['playlist', "user", "loggedin"],
        data() {
          return {
            playlistName: '',
            toggleHover: false,
            hoverIndex: -1,
            hoverSL: -1
          }
        },
        computed: {
            sublists() {
                var sublists = [];
                var chunk = [];
                for (var i = 0; i < this.playlist.length; i++){
                    chunk.push(this.playlist[i]);
                    if (chunk.length == 5){
                        sublists.push(chunk);
                        chunk = [];
                    }
                }
                return sublists;
            }
        },
        methods: {
          savePlaylist(){
            //this.myPlaylists.push([this.user.email, this.playlist]);
            this.$emit('save-playlist', {user: this.user.email, playlist: this.playlist, name: this.playlistName})
            //console.log('saved');
          },
          hover(index, sublistIndex){
              this.toggleHover = !this.toggleHover;
              if (this.toggleHover){
                  this.hoverIndex = index;
                  this.hoverSL = sublistIndex;
              }
              else{
                  this.hoverIndex = -1;
                  this.hoverSL = -1;
              }
          },
          hoverDisplay(index, sublistIndex){
                return (this.toggleHover && index == this.hoverIndex && this.hoverSL == sublistIndex) ? {display: "block"} : {display: "none"}
          }
        }
    }
</script>

<style scoped>
.list {
  background-color: #17171b;
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
.albumcover{
    max-height:  10em;
    max-width: 10em;
    margin: 1em;
}
.album{
    text-align: center;
}
.overlay{
    background-color:#000;
    opacity:0.5;
    height: 100%;
    width: 100%;
}
.info{
    position: absolute;
    top: 3em;
    width: 100%;
    height: 100%;
    text-align: center;
}
.info p{
    font-size: .6em;
}
</style>
