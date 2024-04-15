const apiKey = "bb2b7f5666002551c33de32d02707e73";

function getCoordinates (city) {
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    getWeather(data[0].lat, data[0].lon);
                })
            }
        })
    
}

function getWeather (lat, lon) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                })
            }
        })
}