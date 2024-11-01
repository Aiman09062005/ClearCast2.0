const apiKey = '32804b24a847407391c53709241010'; // WeatherAPI.com key

document.getElementById('search-button').addEventListener('click', function() {
    const location = document.getElementById('search-input').value;
    if (location) {
        fetchWeatherData(location);
    }
});

async function fetchWeatherData(location) {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateUI(data);
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function updateUI(data) {
    // Update location information
    document.getElementById('location').textContent = data.location.name;
    document.getElementById('region-country').textContent = 
        `${data.location.region}, ${data.location.country}`;
    document.getElementById('local-time').textContent = data.location.localtime;

    // Update current weather information
    document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('feels-like').textContent = `${data.current.feelslike_c}°C`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    
    // Update weather icon
    document.getElementById('weather-icon').src = 'https:' + data.current.condition.icon;

    // Update rain chance from forecast
    const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain;
    document.getElementById('rain-chance').textContent = `${rainChance}%`;
}