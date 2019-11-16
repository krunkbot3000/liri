require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');



// SPOTIFY KEY
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);



// INPUT VARIABLES
var userAction = process.argv[2];
var userChoice = process.argv[3];

switch (userAction) {
  case "spotify-this-song":
    searchSong(userChoice);
    break;

  case "concert-this":
    searchBand(userChoice);
    break;

  case "movie-this":
    searchMovie(userChoice);
    break;
}



// SEARCH SPOTIFY API
function searchSong() {
  spotify.search({ type: 'track', query: userChoice }, function (err, data) {
    if (err) {
      return console.log('Error: ' + err);
    }
    console.log("--------- SPOTIFY THIS SONG ---------");
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Album Name: " + data.tracks.items[0].album.name);
    console.log("Preview link on Spotify: " + data.tracks.items[0].external_urls.spotify);
    console.log("-------------------------------------");
  });

}



// SEARCH BAND IS IN TOWN API.
function searchBand() {
  var queryUrl = "https://rest.bandsintown.com/artists/" + userChoice + "/events?app_id=codingbootcamp&limit=20";
  axios.get(queryUrl).then(
    function (response) {
      console.log("--------- CONCERT THIS ----------");
      console.log(" ");
      console.log("Search: " + userChoice);
      console.log("---------------------------------");
      for (i = 0; i < response.data.length; i++) {

        

        //VENUES WITHOUT REGIONS
        if (response.data[i].venue.region === "") {
          console.log(response.data[i].venue.name);
          console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
          console.log(moment(response.data[i].datetime).format('MM-DD-YYYY'));
          console.log("---------------------------------");
        }


        // VENUES WITH REGIONS
        else {
          console.log(response.data[i].venue.name);
          console.log(response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
          console.log(moment(response.data[i].datetime).format('MM-DD-YYYY'));
          console.log("---------------------------------");
        }
      }
    })
    .catch(function (error) {
      if (error.response) {
        


        // ERROR RESPONSES
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        
        console.log(error.request);
      } else {
        
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

}



// SEARCH OMDB API
function searchMovie() {
  var queryUrl = "http://www.omdbapi.com/?t=" + userChoice + "&y=&plot=short&apikey=trilogy";



  //OMDB API REQUESTS
  axios.get(queryUrl).then(
    function (response) {
      console.log("--------- MOVIE THIS ---------");
      console.log("Movie Title: " + response.data.Title);
      console.log("The movie came out in: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("The movie was produced in: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Main actors in the movie are: " + response.data.Actors);
      console.log("------------------------------");
    })
    .catch(function (error) {
      if (error.response) {


        
        // ERROR RESPONSES
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        
        console.log(error.request);
      } else {
        
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}