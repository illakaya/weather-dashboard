// Store API key here so it can be called easily.
const apiKey = 'bb2b7f5666002551c33de32d02707e73';
// Retrieve DOM elements and store so it can be called easily.
const cityListEl = document.getElementById('city-list'),
todayWeatherEl = document.getElementById('today-weather'),
forecastEl = document.getElementById('forecast'),
day5El = document.getElementById('day5'),
cityForm = document.getElementById('city-form'),
cityInput = document.getElementById('city-place');
let cityHistory = JSON.parse(localStorage.getItem('cityList'));

// Create a function that will retrieve a city's latitude and longitude.
function getCoordinates (city) {
    // Creates a variable that will hold the access link.
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    // Fetch the data stored by the API.
    fetch(apiUrl)
        .then(function (response) {
            // If the response is ok,
            if(response.ok) {
                // then process the data from a JSON format
                response.json().then(function (data) {
                    // and push the information into the getWeather function.
                    console.log(data);
                    getWeather(data[0].lat, data[0].lon);
                })
                // If the response retrieves an error,
            } else {
                // alert the user.
                alert(`Error: ${city} ${response.statusText}`);
                return;
            }
        })

}

// Creates a function that will retrieve a city's weather forecast for the next 117 hours (in sets of 3 hours in UTC)
function getWeather (lat, lon) {
    // Create a variable that will hold the access link.
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    // Fetch the data stores by the API.
    fetch(apiUrl)
        .then(function (response) {
            // If the response is ok,
            if(response.ok) {
                // then process the data from a JSON format
                response.json().then(function (data) {
                    // and push the information into the displayWeather function.
                    console.log(data);
                    displayWeather(data);
                })
                // If the response retrieves an error,
            } else {
                // alert the user.
                alert(`Error: ${city} ${response.statusText}`);
                return;
            }
        }) 
}

// Create a function that will fill the HTML with elements to display the weather data.
function displayWeather (data) {
    // Empty DOM HTML elements.
    todayWeatherEl.innerHTML = '';
    forecastEl.innerHTML = '';

    // Make the element display in the HTML instead of none.
    day5El.style.display = 'block';
    // Using a for loop, create display current weather and a 5 day forecast.
    for (let i = 0; i < 6; i++) {
        // Create a card with Bulma classes.
        const cardEl = document.createElement('div');
        cardEl.classList = 'box block column mx-3';
        // Access every 8th element and subtract 1 because of array indexing.
        let a = i * 8 - 1;
        // When looking at today's weather
        if (i === 0) {
            // let a = 0 to access the first array item
            a = 0;
            // and add the city name to the main card.
            const cityMainEl = document.createElement('h3');
            cityMainEl.textContent = `${data.city.name}`;
            cardEl.appendChild(cityMainEl);
        }
        // Create the date element,
        const dateEl = document.createElement('h4');
        dateEl.textContent = dayjs.unix(data.list[a].dt).format('DD/MM/YYYY');
        // the icon element,
        const iconEl = document.createElement('img');
        iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[a].weather[0].icon}@2x.png`);
        // the temperature element,
        const tempEl = document.createElement('p');
        tempEl.textContent = `Temp: ${data.list[a].main.temp}°C`;
        // the wind element
        const windEl = document.createElement('p');
        windEl.textContent = `Wind: ${data.list[a].wind.speed} km/h`;
        // and the humidity element.
        const humidEl = document.createElement('p');
        humidEl.textContent = `Humidity: ${data.list[a].main.humidity}%`;
        // Append each of the elements into the card.
        cardEl.appendChild(dateEl);
        cardEl.appendChild(iconEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidEl);
        // For the first card, append it in its own div so it appears the largest,
        if (a === 0) {
            todayWeatherEl.appendChild(cardEl);
        } else {
            // then append the rest in another div so they appear side by side.
            forecastEl.appendChild(cardEl);
        }
    }
    // Create a function that will check if the city is already store in localStorage
    function checkCity(cityName) {
        // by checking the cityHistory array
        return cityHistory.some(function(obj) {
            // if it contains the cityName, returning a boolean.
            return obj.city.name.includes(cityName);
        })
    }
    // If the city is in the list,
    if (checkCity(data.city.name)) {
        // end the function,
        return;
    } else {
        // otherwise, create the button and store the name and coordinates in local storage because I make the recall with a single API call rather than two.
        button(data);
        let cityDetails = {
            city: {
                name: data.city.name,
                coord: {
                    lat: data.city.coord.lat,
                    lon: data.city.coord.lon,
                }
            }
        }
        cityHistory.push(cityDetails);
        localStorage.setItem('cityList', JSON.stringify(cityHistory));
    }
}

// Create a function that will create a button for users to click to retrieve weather for past searches.
function button (data) {
    // Create a button with Bulma classes and store the city name to it to retrieve later.
    const buttonDiv = document.createElement('div');
    buttonDiv.classList = 'field has-addons is-fullwidth';
    const buttonP1 = document.createElement('p');
    buttonP1.classList = 'control is-expanded';
    const buttonEl1 = document.createElement('button');
    buttonEl1.textContent = data.city.name;
    buttonEl1.classList = 'button block is-fullwidth';
    buttonEl1.setAttribute('city-name', data.city.name.replaceAll(' ', ''));
    // Create a delete button and store the city name to it to retrieve later.
    const buttonP2 = document.createElement('p');
    buttonP2.classList = 'control';
    const buttonEl2 = document.createElement('button');
    buttonEl2.classList = 'delete';
    buttonEl2.setAttribute('city-name', data.city.name.replaceAll(' ', ''));
    //  Append it to the cityList element.
    buttonP2.appendChild(buttonEl2);
    buttonP1.appendChild(buttonEl1);
    buttonDiv.appendChild(buttonP1);
    buttonDiv.appendChild(buttonP2);
    cityListEl.appendChild(buttonDiv);
}

// Create a function that will delete cities from the list.
function handleDeleteCity (event) {
    // For the delete button clicked, identify the attribute of the city id that was attached.
    const cityId = event.target.getAttribute('city-name');
    // Loop through the city array and remove the city with the matching name.
    for (let i = 0; i < cityHistory.length; i++) {
        if (cityHistory[i].city.name.replaceAll(' ', '') === cityId) {
            cityHistory.splice(i, 1);
        }
    }
    // Save the new cityarray to localStorage.
    localStorage.setItem('cityList', JSON.stringify(cityHistory));

    // Render the city buttons back to the screen.
    renderLocation();
}

// Create a function that will display weather when past searches are clicked.
function handlePastCity (event) {
    console.log(event.target);
    // For the city button clicked, identify the attribute of the city id that was attached.
    const cityId = event.target.getAttribute('city-name');
    for (let i = 0; i < cityHistory.length; i++) {
        if (cityHistory[i].city.name.replaceAll(' ', '') === cityId) {
            getWeather(cityHistory[i].city.coord.lat, cityHistory[i].city.coord.lon);
        }
    }
}

// Create a function that will render the stored the cities if the array exists and is not empty.
function renderLocation () {
    if (!cityHistory) {
        cityHistory = [];
        return;
    }
    cityListEl.innerHTML = '';
    for (let city of cityHistory) {
        button(city);
    }
}

// Look for the form submission, prevent the page from refreshing, run the function to retrieve the weather and then empty the form.
cityForm.addEventListener('submit', function (event) {
    event.preventDefault();
    getCoordinates(cityInput.value);
    cityInput.value = '';
});

// Look for a click specifically on the city buttons and then run the function.
cityListEl.addEventListener('click', function (event) {
    if(event.target.classList.contains('is-fullwidth')) {
        handlePastCity(event);
    }
});

// Look for a click specifically on the delete buttons and then run the function.
cityListEl.addEventListener('click', function (event) {
    if(event.target.classList.contains('delete')) {
        handleDeleteCity(event);
    }
});

// When the page loads, call the function.
renderLocation();