// openstreetmap API
var API_KEY = "8bf5f2722c9876aa403f1c90a0b421c1";
var searchButton = document.querySelector("#search-btn");
var cityInputEl = document.querySelector("#city-name");
var searchForm = document.getElementById("search-form");
var destinationInput = document.getElementById("city-name");
var searchList = document.getElementById("searches");
let destinations = [];

// Basic ticking clock that runs on webpage load.
window.onload = function() {
  setInterval(() => {
      document.getElementById("clock").textContent = `${moment().format("dddd, HH:mm:ss")}`;
  }, 1000);
};

console.log(searchForm);

searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  let destinationText = destinationInput.value.trim();
  if (destinationText === "") {
      return;
  }
  destinations.push(destinationText);
  storeDestinations();
  listDestinations();
  console.log(cityInputEl.value)
  getLatandLon(cityInputEl.value);
});

function getLatandLon(cityName) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      currentWeather(data[0].lat, data[0].lon);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

function currentWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts,daily&units=imperial&appid=${API_KEY}`
  )
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      displayWeather(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

var weatherCard = document.getElementById("weatherCard");
function displayWeather(data) {
    console.log(data, "displayWeather")
  weatherCard.innerHTML = `
    <h2>WEATHER:</h2>
    <p class="content">Temperature:${data.current.temp}°F</p>
    <p class="content">Wind Speed:${data.current.wind_speed}mph</p>
     <p class="content">Humidity:${data.current.humidity}%</p>
    <p class="content">UV Index:${data.current.uvi}</p>
    `;
};

function listDestinations() {

  searchList.innerHTML = "";

  for (var i = 0; i < destinations.length; i++) {
      let prevDestinations = destinations[i];

      let button = document.createElement('button');
      button.setAttribute('class', 'button is-danger is-outlined is-fullwidth searches-2');

      let list = document.createElement("p");
      list.textContent = prevDestinations;
      list.setAttribute("data-index", i);

      button.appendChild(list)
      searchList.appendChild(button);
  }
};

function storeDestinations() {
  localStorage.setItem("destinations", JSON.stringify(destinations));
};

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let destinationText = destinationInput.value.trim();
  if (destinationText === "") {
      return;
  }
  destinations.push(destinationText);
  storeDestinations();
  listDestinations();
});

function init() {
  let storedDestinations = JSON.parse(localStorage.getItem("destinations"));

  if (storedDestinations !== null) {
      destinations = storedDestinations;
  }
  listDestinations();
};

let buttonClear = document.getElementById("clear-button");
// let buttonClear = $("#clear-button");
console.log(buttonClear);

buttonClear.addEventListener("click", function() {
    console.log("here");
    localStorage.clear();
    location.reload();    
});

init();