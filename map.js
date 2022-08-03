// Building the map and centering it on San Diego - this uses Leaflet, an open-source JS library and tiles from OpenStreetMaps

let map = L.map('map').setView([32.7157, -117.1611], 12);

// identifying the checkboxes
let publicToilet = document.getElementById('public-restrooms');
let publicArt = document.getElementById('public-art');
let museums = document.getElementById('museums');

//customizing the icon sizes
let newIcon = L.Icon.extend({
    options: {
        iconSize: [35, 50],
        popupAnchor: [0, 0]
    }
});

// Links to the custom icons
let blackIcon = new newIcon({ iconUrl: 'blackIcon.png' }),
    blueIcon = new newIcon({ iconUrl: 'blueIcon.png' }),
    pinkIcon = new newIcon({ iconUrl: 'pinkIcon.png' });

//building the map with leaflet
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const weatherAPIKey = "8bf5f2722c9876aa403f1c90a0b421c1";
const searchFormEl = document.querySelector("#search-btn");

let cityInput = document.getElementById("city-name");

// formSubmitHandler for building the map markers
let formSubmitHandler = function (event) {
    event.preventDefault();
    let cityName = cityInput.value.trim();

    if (cityName) {
        relocate(cityName);
    } else {
        alert('Please enter a city name');
    }
}

// repositioning the map and populating the markers
let relocate = function (city) {

    let cityURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + weatherAPIKey;
    let latLonData;

    fetch(cityURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    latLonData = data;
                    console.log(latLonData);

                    let latitude = data[0].lat;
                    let longitude = data[0].lon;

                    map.panTo([latitude, longitude]);

                    // only collects data for the current map boundaries

                    let north = map.getBounds().getNorth();
                    let east = map.getBounds().getEast();
                    let south = map.getBounds().getSouth();
                    let west = map.getBounds().getWest();

                    let bbox = south + ',' + west + ',' + north + ',' + east;
                    console.log(bbox);

                    // museum markers
                    if (museums.checked) {
                        fetch(
                            'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["tourism"="museum"](' + bbox + ');way["tourism"="museum"](' + bbox + ');relation["tourism"="museum"](' + bbox + '););out;>;out skel qt;'
                        )
                            .then((result) => {
                                return result.json();
                            })
                            .then((data) => {
                                console.log(data);

                                for (var i = 0; i < 25; ++i) {
                                    if (data.elements[i].tags.name) {
                                        let popupName = data.elements[i].tags.name;

                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: pinkIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    }
                                    else {
                                        let popupName = "Museum here";
                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: pinkIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    }
                                }

                            })
                    }

                    // public restroom markers
                    if (publicToilet.checked) {
                        fetch(
                            'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["amenity"="toilets"](' + bbox + ');way["amenity"="toilets"](' + bbox + ');relation["amenity"="toilets"](' + bbox + '););out;>;out skel qt;'
                        )
                            .then((result) => {
                                return result.json();
                            })
                            .then((data) => {
                                console.log(data);

                                for (var i = 0; i < 25; ++i) {

                                    if (data.elements[i].tags.name) {
                                        let popupName = data.elements[i].tags.name;

                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: blackIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    } else {
                                        let popupName = "Toilet here";

                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: blackIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    }
                                }

                            })
                    }

                    // public art markers
                    if (publicArt.checked) {
                        fetch(
                            'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["tourism"="artwork"](' + bbox + ');way["tourism"="artwork"](' + bbox + ');relation["tourism"="artwork"](' + bbox + '););out;>;out skel qt;'
                        )
                            .then((result) => {
                                return result.json();
                            })
                            .then((data) => {
                                console.log(data);

                                for (var i = 0; i < 25; ++i) {
                                    if (data.elements[i].tags.name) {
                                        let popupName = data.elements[i].tags.name;

                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: blueIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    }
                                    else {
                                        let popupName = "Artwork here";
                                        L.marker([data.elements[i].lat, data.elements[i].lon], { icon: blueIcon })
                                            .bindPopup('<a href="" target="_blank" rel="noopener">' + popupName + '</a>')
                                            .addTo(map);
                                    }
                                }

                            })
                    }

                })
            }
        })
};

searchFormEl.addEventListener("click", formSubmitHandler);

// repopulates map with previous search data
$('#searches').on("click", (event) => {
    event.preventDefault();

    $('.searches-2').val(event.target.textContent);
    prevSearchCity=$('.searches-2').val();
    relocate(prevSearchCity);
});