drt25 and na148
Douglas Talbert and Naman Agarwal
Our application is useful because it is fully implemented with the Spotify api and generates custom playlists for Spotify users based on any number of songs or artists that they like. Spotify allows users to create a radio based on a single artist or song, but sometimes people want a radio based on multiple songs or artists, and our application does just that. 
In order to access the user features, you must login with a valid Spotify account (can use Facebook login). The administrator password is 'hello'.
Song data comes from the Spotify api and from user inputs
Using Vue components was very helpful because it allowed us to break our application into different "chunks" and organize it in a more straightforward way. One con of using Vue components was that we had to utilize different scoping styles and emit data from child to parent components
Started April 8, 2018
Completed April 30, 2018
Did not discuss outside of the group
Used https://glitch.com/edit/#!/spotify-implicit-grant?path=README.md:1:0 , The Spotify api, Vue documentation, axios documentaion, Vuefire documentation, Firebase documentation, and bootstrap documentation
All album images are fetched from the Spotify api and the loading gif is from loading.io which released it with a CC0 license
Minor concerns are that the login button must be clicked twice and that the change in background color only applies to the template of the App.Vue component (Not all of index.html, which is why the 'light' theme doesn't fully apply)
