const apiKey = "bb2b7f5666002551c33de32d02707e73";

function getWeather (city) {
    // lets users enter cities with spaces, removes the spaces in the city
    function removeSpaces(str) {
        return str.split(' ').join('');
    }
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${removeSpaces(city)}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if(response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                })
            } else {
                alert(`Error: ${city} ${response.statusText}`);
            }
        }) 
}