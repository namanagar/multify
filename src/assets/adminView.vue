<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h4>Administrative View</h4>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        Visits: {{this.numVisits}}
      </div>
      <div class="col-md-6">
        Total Playlists: {{this.numPlaylists}}
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        Select Playlists to Delete Below:
      </div>
    </div>
    <div v-for="(p, index) in playlistList" :key="index">
      <div class="row" @click="markForDel(p)">
        <div v-bind:class="{ marked: isMarked(p) }" class="col-md-6">{{p.name}}</div>
        <div v-bind:class="{ marked: isMarked(p) }" class="col-md-6">{{p.user}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button type="button" class="btn btn-success btn-block" @click="removePlaylist()">Delete</button>
      </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <button type="button" class="btn btn-danger btn-block" @click="$emit('back')">Back</button>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "admin-view",
    props: ["num-visits", "num-playlists", "playlist-list"],
    data() {
      return {
        markedDelete: []
      }
    },
    methods: {
      removePlaylist() {
        this.$emit("remove-playlist", this.markedDelete)
      },
      markForDel(pl) {
        if(this.markedDelete.indexOf(pl)===-1){
          this.markedDelete.push(pl);
        }
        else{
          this.markedDelete.splice(this.markedDelete.indexOf(pl), 1);
        }
      },
      isMarked(pl){
        if(this.markedDelete.indexOf(pl)!==-1){
          return true;
        }
      }
    }
  }
</script>


<style scoped>
  .row {
    text-align: center;
  }
  .marked {
    color: red;
  }
</style>
