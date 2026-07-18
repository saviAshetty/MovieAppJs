// ==============================
// OMDb API Key
// ==============================

const API_KEY = "17f8307a";

// ==============================
// Elements
// ==============================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const movieContainer = document.getElementById("movieContainer");
const loader = document.getElementById("loader");

const suggestions = document.getElementById("suggestions");

// ==============================
// Loading
// ==============================

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

// ==============================
// Search Movie
// ==============================

async function searchMovie(movieName) {

    if(movieName.trim()==""){
        movieContainer.innerHTML="<h2>Please enter movie name</h2>";
        return;
    }

    showLoader();

    try{

        const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${movieName}`
        );

        const data = await response.json();

        hideLoader();

        if(data.Response=="False"){

            movieContainer.innerHTML="<h2>Movie Not Found</h2>";
            return;

        }

        saveHistory(movieName);

        displayMovie(data);

    }
    catch(error){

        hideLoader();

        movieContainer.innerHTML="<h2>Something went wrong.</h2>";

        console.log(error);

    }

}

// ==============================
// Display Movie
// ==============================

function displayMovie(movie){

    let rating="N/A";

    if(movie.Ratings.length>0){

        rating=movie.Ratings[0].Value;

    }

    movieContainer.innerHTML=`

    <div class="movieCard">

        <img src="${movie.Poster}" alt="">

        <div class="cardText">

            <h1>${movie.Title}</h1>

            <p><strong>Year :</strong> ${movie.Year}</p>

            <p><strong>Genre :</strong> ${movie.Genre}</p>

            <p><strong>Rating :</strong> ${rating}</p>

            <p><strong>Released :</strong> ${movie.Released}</p>

            <p><strong>Runtime :</strong> ${movie.Runtime}</p>

            <p><strong>Language :</strong> ${movie.Language}</p>

            <p><strong>Actors :</strong> ${movie.Actors}</p>

            <p><strong>Plot :</strong> ${movie.Plot}</p>

            <br>

            <button class="favoriteBtn"
            onclick="addFavorite('${movie.imdbID}')">

                ❤️ Add Favorite

            </button>

        </div>

    </div>

    `;

}

// ==============================
// Search Button
// ==============================

searchBtn.addEventListener("click",()=>{

    searchMovie(searchInput.value);

});

// ==============================
// Enter Key
// ==============================

searchInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchMovie(searchInput.value);

    }

});

// ==============================
// Search Suggestions
// ==============================

searchInput.addEventListener("input", async ()=>{

    const value=searchInput.value.trim();

    if(value.length<2){

        suggestions.style.display="none";

        return;

    }

    const response=await fetch(

`https://www.omdbapi.com/?apikey=${API_KEY}&s=${value}`

    );

    const data=await response.json();

    suggestions.innerHTML="";

    if(data.Search){

        data.Search.slice(0,5).forEach(movie=>{

            const div=document.createElement("div");

            div.innerText=movie.Title;

            div.onclick=()=>{

                searchInput.value=movie.Title;

                suggestions.style.display="none";

                searchMovie(movie.Title);

            };

            suggestions.appendChild(div);

        });

        suggestions.style.display="block";

    }

});

// ==============================
// Search History
// ==============================

function saveHistory(movie){

    let history=

    JSON.parse(localStorage.getItem("history")) || [];

    history=history.filter(item=>item!=movie);

    history.unshift(movie);

    history=history.slice(0,10);

    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );

}
// ==============================
// FAVORITES (Local Storage)
// ==============================

function addFavorite(imdbID) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(imdbID)) {

        favorites.push(imdbID);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        alert("Movie added to Favorites ❤️");

    } else {

        alert("Movie already in Favorites!");

    }

}

// ==============================
// Favorite Popup
// ==============================

const favoriteBtn =
    document.getElementById("favoriteBtn");

const favoritesPopup =
    document.getElementById("favoritesPopup");

const favoriteList =
    document.getElementById("favoriteList");

const closeFavorite =
    document.getElementById("closeFavorite");

favoriteBtn.addEventListener("click", showFavorites);

closeFavorite.addEventListener("click", () => {

    favoritesPopup.style.display = "none";

});

async function showFavorites() {

    favoritesPopup.style.display = "flex";

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteList.innerHTML = "";

    if (favorites.length === 0) {

        favoriteList.innerHTML =
            "<p>No favorite movies.</p>";

        return;
    }

    for (let id of favorites) {

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
        );

        const movie = await response.json();

        favoriteList.innerHTML += `

        <div style="padding:10px;border-bottom:1px solid #ddd">

            <strong>${movie.Title}</strong>

            <br>

            ⭐ ${movie.imdbRating}

            <br><br>

            <button onclick="removeFavorite('${id}')">

                Remove

            </button>

        </div>

        `;

    }

}

// ==============================
// Remove Favorite
// ==============================

function removeFavorite(id) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(movie => movie != id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    showFavorites();

}

// ==============================
// Search History Popup
// ==============================

const historyBtn =
    document.getElementById("historyBtn");

const historyPopup =
    document.getElementById("historyPopup");

const historyList =
    document.getElementById("historyList");

const closeHistory =
    document.getElementById("closeHistory");

historyBtn.addEventListener("click", showHistory);

closeHistory.addEventListener("click", () => {

    historyPopup.style.display = "none";

});

function showHistory() {

    historyPopup.style.display = "flex";

    let history =
        JSON.parse(localStorage.getItem("history")) || [];

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No Search History</p>";

        return;

    }

    history.forEach(movie => {

        historyList.innerHTML += `

        <div
            style="padding:10px;
            cursor:pointer;
            border-bottom:1px solid #ddd"
            onclick="searchFromHistory('${movie}')">

            ${movie}

        </div>

        `;

    });

}

function searchFromHistory(movie) {

    historyPopup.style.display = "none";

    searchInput.value = movie;

    searchMovie(movie);

}

// ==============================
// DARK MODE
// ==============================

const themeBtn =
    document.getElementById("themeBtn");

// Load saved theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});
// ====================================
// Close suggestions when clicking outside
// ====================================

document.addEventListener("click", function (e) {

    if (!searchInput.contains(e.target) &&
        !suggestions.contains(e.target)) {

        suggestions.style.display = "none";
    }

});


// ====================================
// Clear Search History
// ====================================

function clearHistory() {

    localStorage.removeItem("history");

    historyList.innerHTML =
        "<p>No Search History</p>";

}


// ====================================
// Add Clear History Button
// ====================================

historyBtn.addEventListener("dblclick", () => {

    if(confirm("Clear Search History?")){

        clearHistory();

    }

});


// ====================================
// Close Popup When Clicking Background
// ====================================

window.onclick = function(e){

    if(e.target == favoritesPopup){

        favoritesPopup.style.display = "none";

    }

    if(e.target == historyPopup){

        historyPopup.style.display = "none";

    }

}


// ====================================
// Default Welcome Message
// ====================================

window.onload = function(){

    movieContainer.innerHTML = `

        <h2 class="welcome">

            🍿 Search your favourite movie

        </h2>

    `;

}