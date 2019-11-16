require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');

// Spotify keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Grab user input and set to the following global variables
var userAction = process.argv[2];
var userChoice = process.argv[3];

// Determines which process to perform.
// Based on userChoice run one of the following
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

// Function to search for song information usinfg spotify API
function searchSong() {
  spotify.search({ type: 'track', query: userChoice }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("--------- SPOTIFY THIS SONG ---------");
    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("Album Name: " + data.tracks.items[0].album.name);
    console.log("Preview link on Spotify: " + data.tracks.items[0].external_urls.spotify);
    console.log("-------------------------------------");
  });

}
// Function to search for Band information usinfg axios and bands in town API.
function searchBand() {
  var queryUrl = "https://rest.bandsintown.com/artists/" + userChoice + "/events?app_id=codingbootcamp&limit=20";
  axios.get(queryUrl).then(
    function (response) {
      console.log("--------- CONCERT THIS ----------");
      console.log(" ");
      console.log("Search: " + userChoice);
      console.log("---------------------------------");
      for (i = 0; i < response.data.length; i++) {
        // If the venue doesn't have a region run the following
        if (response.data[i].venue.region === "") {
          console.log(response.data[i].venue.name);
          console.log(response.data[i].venue.city + ", " + response.data[i].venue.country);
          console.log(moment(response.data[i].datetime).format('MM-DD-YYYY'));
          console.log("---------------------------------");
        }
        // If venue has a region run the following
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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

}

// Function to search for movie information using axios and OMDB API
function searchMovie() {
  var queryUrl = "http://www.omdbapi.com/?t=" + userChoice + "&y=&plot=short&apikey=trilogy";

  // Run a request with axios to the OMDB API with the movie specified
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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}