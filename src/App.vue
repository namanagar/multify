<template>
  <div id="app" :class="{'dark': theme == 'dark', 'light': theme == 'light'}">
    <div class="container" id="wholeapp" v-if="page == 'home'">
      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-3">
              <h3>Multify</h3>
            </div>
            <div class="col-md-9" id="description">
              <p>Ever want to combine the sounds of two or more artists/songs? Use this to generate playlists based on
                multiple artists/songs! If you log in, you can even choose whether explicit songs are allowed or not. </p>
            </div>
          </div>
        </div>
        <div class="col-md-4" v-if="this.user == null">
          <div class="row">
            <button class="btn btn-success" @click="login">Log In</button>
          </div>
        </div>
        <div class="col-md-4" id="userdetails" v-if="this.user != null">
          <div class="row">
            <div class="col-md-4">
              <img :src="user.images[0].url" alt="Profile Pic" id="profilepic">
            </div>
            <div class="col-md-6">
              <h5>User Details:</h5>
              <p>{{ user.display_name }}</p>
              <p>{{ user.email }}</p>
            </div>
            <div class="col-md-2">
              <button type="button" class="btn btn-sm btn-success" @click="openModal">Preferences</button>
              <button type="button" class="btn btn-sm btn-danger" @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="input-group">
            <div class="input-group-prepend">
              <label for="numselect">Number of songs</label>
              <select name="Number of songs" id="numselect" v-model="numSongs">
                <option :value="{ number: 10 }">10</option>
                <option :value="{ number: 20 }">20</option>
                <option :value="{ number: 30 }">30</option>
                <option :value="{ number: 40 }">40</option>
                <option :value="{ number: 50 }">50</option>
              </select>
            </div>
            <div class="input-group-prepend">
              <label for="mode">Mode</label>
              <select name="Mode" id="mode" v-model="mode">
                <option :value="{ mode: 'artist' }">Artist</option>
                <option :value="{ mode: 'song' }">Song</option>
              </select>
            </div>
            <label for="names">Names</label>
            <input type="text" class="form-control" id="names" :disabled="!loggedIn" :placeholder="placeholder"
                  v-model="input">
            <div class="input-group-append">
              <button class="btn btn-outline-success" type="button" @click="generate()">Go!</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="loading">
        <div class="col-md-12 center">
          <!-- <img src="./assets/loading.gif" alt="Loading..."> -->
          <img src="src/assets/loading.gif"/>
        </div>
      </div>
      <my-playlists v-if="this.user != null" :playlist-list="this.userPlaylists" :user="true" @select-playlist="selectPlaylist"></my-playlists>
      <my-playlists v-if="this.user===null" :playlist-list="this.myPlaylists" :user="false" @select-playlist="selectPlaylist"></my-playlists>
      <div class="row">
        <div class="col-md-12 center">
          <div class="btn-group btn-group-toggle">
            <label class="btn" :class="[(this.view == 'list') ? 'btn-success' : 'btn-outline-success']">
              <input type="radio" name="options" id="option1" autocomplete="off" value="list" v-model="view"> List
            </label>
            <label class="btn" :class="[(this.view == 'grid') ? 'btn-success' : 'btn-outline-success']">
              <input type="radio" name="options" id="option2" autocomplete="off" value="grid" v-model="view"> Grid
            </label>
          </div>
        </div>
      </div>
      <list-view v-if="this.playlist != null && this.view == 'list'" :user="this.user" :loggedin="loggedIn"
                 :playlist="this.playlist.playlist"
                 @save-playlist="savePlaylist"></list-view>

      <grid-view v-if="this.playlist != null && this.view == 'grid'" :user="this.user" :loggedin="loggedIn"
                 :playlist="this.playlist.playlist"
                 @save-playlist="savePlaylist"></grid-view>

      <div class="row margintop">
        <div class="col-md-4">
          <a @click="showAdminLogin = true">Administrator Login</a>
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-4" v-if="showAdminLogin">
          <div class="input-group">
          <input type="text" placeholder="Admin password" class="form-control" v-model="adminpass">
          <div class="input-group-append">
              <button class="btn btn-outline-success" type="button" @click="adminlogin()">Go!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container" id="admin">
      <admin-view v-if="page == 'admin'" :playlist-list="this.myPlaylists" @remove-playlist="removePlaylist"
                  :num-visits="this.numVisits" :num-playlists="this.numPlaylists"
                  @back="home()"></admin-view>
    </div>
    <preferences :show="showModal" :userpref="userPref" @close="closeModal" @theme="toggleTheme" @explicit="toggleExplicit"></preferences>
  </div>
</template>
<script>
import ListView from "./assets/listView";
import MyPlaylists from "./assets/myPlaylists";
import GridView from "./assets/gridView";
import AdminView from "./assets/adminView";
import Preferences from "./assets/preferences";
//import axios to make the http requests to the spotify api
var axios = require("axios");
var VueFire = require("vuefire");
var firebase = require("firebase");
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBG4Smyjhx_ZVGzbPOi7T-IsbODm3V3CjU",
  authDomain: "final-project-team-1.firebaseapp.com",
  databaseURL: "https://final-project-team-1.firebaseio.com",
  projectId: "final-project-team-1",
  storageBucket: "final-project-team-1.appspot.com",
  messagingSenderId: "845584600865"
};
var db = firebase.initializeApp(config).database();
var playlistsRef = db.ref("playlists");
var usageRef = db.ref("usageData");
var adminRef = db.ref("adminPassword");
var prefRef = db.ref("preferences");
//local storage stuff
var preferences = localStorage.getItem("preferences");
/**************
 *** VUE *****
 **************/
export default {
  components: {
    Preferences,
    AdminView,
    MyPlaylists,
    ListView,
    GridView
  },
  name: "app",
  data() {
    return {
      showAdminLogin: false,
      adminpass: "",
      adminaccess: false,
      input: "",
      mode: { mode: "artist" },
      loading: false,
      numSongs: { number: 10 },
      playlist: null,
      user: null,
      _token: "",
      view: "list",
      page: "home",
      explicit: true,
      showModal: false,
      theme: "dark",
      userPref: {dark: true, explicit: true, user: 'guest'}
    };
  },
  firebase: {
    myPlaylists: playlistsRef,
    usageData: usageRef,
    adminPassword: adminRef,
    userPrefs: prefRef
  },
  created: function() {
    // this.$firebaseRefs.usageData.child(visits['.key']).set(lkasjjdlkjaldkj);
    this.$firebaseRefs.usageData.push("1");
  },
  computed: {
    placeholder() {
      return this.loggedIn
        ? "Type in two or more " + this.mode.mode + "s' names, comma separated"
        : "Log in to generate playlists";
    },
    numUsers: function() {
      return this.myUsers.length;
    },
    numVisits: function() {
      return this.usageData.length;
    },
    numPlaylists: function() {
      return this.myPlaylists.length;
    },
    userPlaylists: function() {
      var toRet = [];
      var m = this.user.email;
      this.myPlaylists.forEach(function(e) {
        if (e.user === m) toRet.push(e);
      });
      //return {user: this.user.email, playlist: toRet, name: this.playlistName};
      return toRet;
    },
    loggedIn: function(){
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      this._token = hash.access_token;
      const idk = hash.access_token;
      var retVal = false;
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + this._token
          }
        })
        .then(
          response => {
            this.user = response.data;
            var userPref;
            var m = this.user.email;
            this.userPrefs.forEach(function(e) {
              if (e.user === m) {
                userPref = e;
              }
            });
            this.userPref = userPref;
            if (!this.userPref) {
              this.userPref = {
                dark: true,
                explicit: true,
                user: this.user.email
              };
              this.$firebaseRefs.userPrefs.push(userPref);
            }
            // this code has to be doubled here to make sure this.userPref is a firebase obj not a POJO
            this.userPrefs.forEach(function(e) {
              if (e.user === m) {
                userPref = e;
              }
            });
            this.dark = userPref.dark;
            this.theme = this.dark ? 'dark' : 'light';
            this.explicit = userPref.explicit;
            this.userPref = userPref;
            this._token = idk;
            retVal = true;
          },
          error => {
            console.log("error: " + error);
            retVal = false;
          }
        );
        return retVal;
    }
  },
  methods: {
    toggleTheme() {
      if (this.userPref.dark) {
        /*this.$firebaseRefs.userPrefs
          .child(userPref[".key"])
          .child("dark")
          .set(false); */
        this.$firebaseRefs.userPrefs
          .child(this.userPref[".key"])
          .child("dark")
          .set(false);
        this.theme = "light";
        this.userPref.dark = false;
      } else {
        this.$firebaseRefs.userPrefs
          .child(this.userPref[".key"])
          .child("dark")
          .set(true);
        this.theme = "dark";
        this.userPref.dark = true;
      }
    },
    toggleExplicit() {
      if (this.userPref.explicit) {
        this.$firebaseRefs.userPrefs
          .child(this.userPref[".key"])
          .child("explicit")
          .set(false);
        this.explicit = false;
        this.userPref.explicit = false;
      } else {
        this.$firebaseRefs.userPrefs
          .child(this.userPref[".key"])
          .child("explicit")
          .set(true);
        this.explicit = true;
        this.userPref.explicit = true;
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    selectPlaylist(payload) {
      this.playlist = payload;
    },
    async login() {
      /**************
       *** AUTH *****
       **************

       this code is taken (very slightly modified) from https://glitch.com/edit/#!/spotify-implicit-grant?path=README.md:1:0
       which explains how to follow the spotify implicit grant authorization flow

       a piazza post said we could use >5 lines of code for auth purposes*/
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      //window.location.hash = "";
      // Set token
      this._token = hash.access_token;
      const authEndpoint = "https://accounts.spotify.com/authorize";
      // Replace with your app's client ID, redirect URI and desired scopes
      const clientId = "cf6ae46384e94e3d8209dc29f0694ee0";
      const redirectUri = "https://namanagar.github.io/multify/";
      const scopes = [
        "user-top-read playlist-modify-private playlist-modify-public user-read-private user-read-email"
      ];
      // If there is no token, redirect to Spotify authorization
      if (!this._token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`;
      }
    },
    logout(){
      this.user = null;
      this.userPref = {dark: true, explicit: true, user: 'guest'};
      this.explicit = true;
      this.dark = true;
      this.theme = "dark";
      this._token = null;
    },
    async getArtists(artists) {
      var artistIDs = [];
      for (var i = 0; i < artists.length; i++) {
        artists[i] = artists[i].split(" ").join("%20");
        await axios
          .get(
            `https://api.spotify.com/v1/search?q=${artists[i]}&type=artist`,
            {
              headers: {
                Authorization: "Bearer " + this._token
              }
            }
          )
          .then(
            response => {
              //console.log(response.data.artists.items[0].id);
              if(response.data.artists.items[0]!==undefined)
               artistIDs.push(response.data.artists.items[0].id);
              else {
                alert("Invalid artist")
                this.loading=false;
                this.input = '';
                return
              }
            },
            error => {
              console.log("error: " + error);
            }
          );
      }
      return artistIDs;
    },
    async getAllTopTracks(artistIDs) {
      var topTracks = [];
      for (var i = 0; i < artistIDs.length; i++) {
        await axios
          .get(
            `https://api.spotify.com/v1/artists/${
              artistIDs[i]
            }/top-tracks?country=US`,
            {
              headers: {
                Authorization: "Bearer " + this._token
              }
            }
          )
          .then(
            response => {
              //console.log(response.data);
              response.data.tracks.forEach(element => {
                if (!this.explicit) {
                  if (!element.explicit) {
                    topTracks.push(element);
                  }
                } else {
                  topTracks.push(element);
                }
              });
            },
            error => {
              console.log("error: " + error);
            }
          );
      }
      return topTracks;
    },
    async getRelatedArtists(artistIDs) {
      var allIDs = [];
      artistIDs.forEach(element => {
        allIDs.push(element);
      });
      for (var i = 0; i < artistIDs.length; i++) {
        await axios
          .get(
            `https://api.spotify.com/v1/artists/${
              artistIDs[i]
            }/related-artists`,
            {
              headers: {
                Authorization: "Bearer " + this._token
              }
            }
          )
          .then(
            response => {
              //console.log(response.data);
              response.data.artists.forEach(element => {
                allIDs.push(element.id);
              });
            },
            error => {
              console.log("error: " + error);
            }
          );
      }
      return allIDs;
    },
    async getSongArtists(songs) {
      var songArtists = [];
      for (var i = 0; i < songs.length; i++) {
        songs[i] = songs[i].split(" ").join("%20");
        await axios
          .get(`https://api.spotify.com/v1/search?q=${songs[i]}&type=track`, {
            headers: {
              Authorization: "Bearer " + this._token
            }
          })
          .then(
            response => {
              if(response.data.tracks.items[0]!==undefined)
              songArtists.push(response.data.tracks.items[0].artists[0].id);
              else{
                alert("Invalid song");
                this.loading=false;
                this.input = '';
                return
              }
            },
            error => {
              console.log("error: " + error);
            }
          );
      }
      return songArtists;
    },
    async generate() {
      this.loading = true;
      if (this.mode.mode == "artist") {
        var artists = this.input.split(",");


          const artistIDs = await this.getArtists(artists);
          const allIDs = await this.getRelatedArtists(artistIDs);
          const allTopTracks = await this.getAllTopTracks(allIDs);


        // allTopTracks is a master playlist of (num artists)*10 tracks
        // this shuffles it using 4 lines from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        for (let i = allTopTracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allTopTracks[i], allTopTracks[j]] = [
            allTopTracks[j],
            allTopTracks[i]
          ];
        }
        this.playlist = {
          name: "default",
          playlist: allTopTracks.slice(0, this.numSongs.number),
          user: this.user.email
        };
        this.loading = false;
      } else if (this.mode.mode == "song") {
        var songs = this.input.split(",");

       // try {
          const songArtists = await this.getSongArtists(songs);
          const allIDs = await this.getRelatedArtists(songArtists);
          const allTopTracks = await this.getAllTopTracks(allIDs);
       /* } catch(error) {
          alert("Please enter two or more valid songs.");
          this.loading=false;
          this.input = '';
          return
        }*/
        // allTopTracks is a master playlist of (num artists)*10 tracks
        // this shuffles it using 4 lines from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
        for (let i = allTopTracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allTopTracks[i], allTopTracks[j]] = [
            allTopTracks[j],
            allTopTracks[i]
          ];
        }
        this.playlist = {
          name: "default",
          playlist: allTopTracks.slice(0, this.numSongs.number),
          user: this.user.email
        };
        this.loading = false;
      }
    },
    savePlaylist(payload) {
      this.$firebaseRefs.myPlaylists.push(payload);
    },
    removePlaylist(payload) {
      var r = this.$firebaseRefs;
      payload.forEach(function(e) {
        r.myPlaylists.child(e[".key"]).remove();
      });
    },
    adminlogin() {
      if (this.adminpass == this.adminPassword[0].password) {
        this.page = "admin";
      } else {
        alert("Incorrect admin password!");
        this.adminpass = "";
      }
    },
    home() {
      this.page = "home";
      this.showAdminLogin = false;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Raleway");
#app {
  font-family: "Raleway", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.dark {
  color: #ffffff;
  background-color: #17171b;
}
.light {
  color: #17171b;
  background-color: #ffffff;
}
h1,
h2 {
  font-weight: normal;
  margin: 1em;
}

a {
  color: #1db954;
}

.center {
  text-align: center;
}

p {
  font-size: 0.75em;
}

label{
  display: none;
}
#profilepic {
  max-width: 5em;
  max-height: 5em;
}

#wholeapp {
  margin-top: 3em;
  margin-bottom: 5em;
}

#admin {
  margin-top: 3em;
  margin-bottom: 5em;
}
.margintop {
  margin-top: 5em;
}
small {
  font-size: 0.6em;
}
</style>
