const apiKey = 'bb2b7f5666002551c33de32d02707e73';
const cityListEl = document.querySelector('#city-list');
const todayWeatherEl = document.querySelector('#today-weather');
const forecastEl = document.querySelector('#forecast');

function getCoordinates (city) {
    function removeSpaces(str) {
        return str.split(' ').join('');
    }
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${removeSpaces(city)}&limit=1&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    getWeather(data[0].lat, data[0].lon);
                })
            } else {
                alert(`Error: ${city} ${response.statusText}`);
                return;
            }
        })

}

function getWeather (lat, lon) {
    // const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${removeSpaces(city)}&units=metric&appid=${apiKey}`;
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data);
                })
            } else {
                alert(`Error: ${city} ${response.statusText}`);
                return;
            }
        }) 
}

function displayWeather (data) {
    // empty html
    todayWeatherEl.innerHTML = '';
    forecastEl.innerHTML = '';
    
    button(data.city.name);
    let day5El = document.getElementById('day5');
    day5El.style.display = "block";
    for (let i = 0; i <= 5; i++) {
        const cardEl = document.createElement('div');
        cardEl.classList = 'box block column mx-3';
        let a = i * 8 - 1;
        if (i === 0) {
            a = 0;
            const cityMainEl = document.createElement('h3');
            cityMainEl.textContent = `${data.city.name}`;
            cardEl.appendChild(cityMainEl);
        }
        

        const dateEl = document.createElement('h4');
        dateEl.textContent = data.list[a].dt_txt.substring(0, 10);

        const iconEl = document.createElement('img');
        iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[a].weather[0].icon}@2x.png`);

        const tempEl = document.createElement('p');
        tempEl.textContent = `Temp: ${data.list[a].main.temp}°C`;

        const windEl = document.createElement('p');
        windEl.textContent = `Wind: ${data.list[a].wind.speed} km/h`;

        const humidEl = document.createElement('p');
        humidEl.textContent = `Humidity: ${data.list[a].main.humidity}%`;
        
        cardEl.appendChild(dateEl);
        cardEl.appendChild(iconEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidEl);
        if (a === 0) {
            todayWeatherEl.appendChild(cardEl);
        } else {
        forecastEl.appendChild(cardEl);
        }
    }
}

function button (city) {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = city;
    buttonEl.classList = "button block is-fullwidth";
    cityListEl.appendChild(buttonEl);
}