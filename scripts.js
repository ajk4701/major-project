/* scripts for movie recommendation app */
/*this project uses the TMDb API to fetch movie data. You can sign up for a free API key at https://www.themoviedb.org/documentation/api */

//api key for TMDb API
const apiKey = "17bd68f8315ba8dcb1e4eaf507bc6343";

//api urls
const apiBaseURL = "https://api.themoviedb.org/3";
const imageBaseURL = "https://image.tmdb.org/t/p/w500";

//html elements
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const surpriseButton = document.querySelector("#surpriseButton");

const movieCard = document.querySelector("#movieCard");
const moviePoster = document.querySelector("#moviePoster");
const movieTitle = document.querySelector("#movieTitle");
const movieDescription = document.querySelector("#movieDescription");
const movieYear = document.querySelector("#movieYear");
const movieRating = document.querySelector("#movieRating");
const movieGenre = document.querySelector("#movieGenre");
const worthWatching = document.querySelector("#worthWatching");
const worthIcon = document.querySelector("#worthIcon");

//genre list got from tdmb API on the website
const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

//event listeners
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const userInput = searchInput.value.trim();
    if (userInput === "") {
        showMessage("Please enter a movie title.");
        return;
    }

    searchMovie(userInput);
});

//surprise me button event listener
surpriseButton.addEventListener("click", function() {
    getRandomMovie();
});

//search for movie
async function searchMovie(searchTerm) {
    try {
        showMessage("Searching...");

        const searchURL = `${apiBaseURL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchTerm)}`;

        const response = await fetch(searchURL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showMessage("No movie found. Please try a different title.");
            return;
        }
        const movie = data.results[0];
        displayMovie(movie);

    } catch (error) {
        console.error("Search error:", error);
        showMessage("Something went wrong. Please try again.");
    }
}

//get random movie
async function getRandomMovie() {
    try {
        showMessage("Finding a movie...");

        //gets a random page from first 10 most popular movies
        const randomPage = Math.floor(Math.random() * 10) + 1;

        const popularURL = `${apiBaseURL}/movie/popular?api_key=${apiKey}&page=${randomPage}`;

        const response = await fetch(popularURL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showMessage("No movies found. Please try again.");
            return;
        }

        //gets a random movie from the page
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomMovie = data.results[randomIndex];

        displayMovie(randomMovie);
    } catch (error) {
        console.error("Random movie error:", error);
        showMessage("Something went wrong. Please try again.");
    }
}

//display movie details
function displayMovie(movie) {
    movieCard.classList.remove("hidden");
    
    movieTitle.textContent = movie.title || "Movie Title";

    //year
    if (movie.release_date) {
        movieYear.textContent = movie.release_date.slice(0, 4);
    } else {
        movieYear.textContent = "N/A";
    }

    //genere
    if (movie.genre_ids && movie.genre_ids.length > 0) {
        const genreNames = movie.genre_ids
        .slice(0, 2) //limit to 2 genres
        .map(id => genres[id])
        .filter(Boolean)
        .join(", ");

        movieGenre.textContent = `Genre: ${genreNames}`;
    } else {
        movieGenre.textContent = "Genre: N/A";
    }

    //rating
    if (movie.vote_average) {
        movieRating.textContent = `Rating: ${movie.vote_average.toFixed(1)}/10`;
    } else {
        movieRating.textContent = "No Rating";
    }

    //worth watching logic
    updateWorthWatching(movie.vote_average);

    //description
    if (movie.overview) {
        movieDescription.textContent = movie.overview;
    } else {
        movieDescription.textContent = "No description available.";
    }

    //poster
    if (movie.poster_path) {
        moviePoster.src = `${imageBaseURL}${movie.poster_path}`;
        moviePoster.alt = `${movie.title} Poster`;
    } else {
        moviePoster.src = "images/no-image.png";
        moviePoster.alt = "No poster available";
    }
}

//update worth watching message and icon based on rating
function updateWorthWatching(rating) {
    if (rating >= 7) {
        worthWatching.innerHTML = `<span>Worth Watching?</span>
        <img id="worthIcon" src="images/like.png" alt="Thumbs Up" class="worth-icon">`;
    } else {
        worthWatching.innerHTML = `<span>Worth Watching?</span>
        <img id="worthIcon" src="images/thumb-down.png" alt="Thumbs Down" class="worth-icon">`;
    }
}

//simple message function
function showMessage(message) {
    movieCard.classList.remove("hidden");
    
    movieTitle.textContent = message;
    movieYear.textContent = "";
    movieGenre.textContent = "";
    movieRating.textContent = "";
    worthWatching.innerHTML = "";
    movieDescription.textContent = "";
    moviePoster.src = "images/no-image.png";
    moviePoster.alt = "No Poster available";
}