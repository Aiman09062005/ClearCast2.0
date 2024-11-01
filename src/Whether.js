const apiKey = '32804b24a847407391c53709241010'; // WeatherAPI.com key

document.getElementById('search-button').addEventListener('click', function() {
    const location = document.getElementById('search-input').value;
    if (location) {
        fetchWeatherData(location);
    }
});

document.getElementById('save-button').addEventListener('click', function() {
    if (window.currentWeatherData) {
        // Let WeatherCRUD handle the saving
        console.log('Initiating save from Whether.js');
    } else {
        alert('Please search for a location first.');
    }
});

async function fetchWeatherData(location) {
    try {
        console.log('Fetching weather data for:', location);
        
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=2&aqi=yes`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('API Response:', data);

        if (data.error) {
            alert(data.error.message);
            return;
        }

        window.currentWeatherData = data;
        
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function updateUI(data) {
    try {
        // Get the forecast data once at the beginning
        const today = data.forecast.forecastday[0];
        const tomorrow = data.forecast.forecastday[1];

        // Update location information
        document.getElementById('location').textContent = data.location.name;
        document.getElementById('region-country').textContent = 
            `${data.location.region}, ${data.location.country}`;
        document.getElementById('local-time').textContent = data.location.localtime;

        // Update current weather
        document.getElementById('temperature').textContent = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById('weather-icon').src = 'https:' + data.current.condition.icon;

        // Update feels like
        document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°C`;

        // Update forecast
        document.getElementById('forecast-temp-today').textContent = 
            `${Math.round(today.day.avgtemp_c)}°C`;
        document.getElementById('forecast-icon-today').src = 
            'https:' + today.day.condition.icon;

        document.getElementById('forecast-temp-tomorrow').textContent = 
            `${Math.round(tomorrow.day.avgtemp_c)}°C`;
        document.getElementById('forecast-icon-tomorrow').src = 
            'https:' + tomorrow.day.condition.icon;

        // Update sunrise/sunset
        document.getElementById('sunrise').textContent = today.astro.sunrise;
        document.getElementById('sunset').textContent = today.astro.sunset;

        // Update weather details
        document.getElementById('wind-speed').textContent = `${Math.round(data.current.wind_kph)} km/h`;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('condition').textContent = data.current.condition.text;

        // Add AQI update
        const aqi = data.current.air_quality["us-epa-index"];
        document.getElementById('aqi-value').textContent = aqi;
        
        // Set AQI description based on EPA standard
        let aqiDescription;
        switch(aqi) {
            case 1:
                aqiDescription = "Good";
                break;
            case 2:
                aqiDescription = "Moderate";
                break;
            case 3:
                aqiDescription = "Unhealthy for Sensitive Groups";
                break;
            case 4:
                aqiDescription = "Unhealthy";
                break;
            case 5:
                aqiDescription = "Very Unhealthy";
                break;
            case 6:
                aqiDescription = "Hazardous";
                break;
            default:
                aqiDescription = "No Data Available";
        }
        document.getElementById('aqi-description').textContent = aqiDescription;
        
        // Daily chance of rain and snow
        document.getElementById('rain-chance').textContent = 
            `${today.day.daily_chance_of_rain}%`;
        document.getElementById('snow-chance').textContent = 
            `${today.day.daily_chance_of_snow}%`;
            
        // Cloud cover and Clear Weather
        document.getElementById('cloud-cover').textContent = 
            `${data.current.cloud}%`;
        document.getElementById('clear-weather').textContent = 
            data.current.condition.text;

        // Update icon colors based on values
        updateConditionColors(
            today.day.daily_chance_of_rain,
            today.day.daily_chance_of_snow,
            data.current.cloud,
            data.current.is_day
        );

        // Get the current weather condition
        const currentCondition = data.current.condition.text.toLowerCase();
        updateActivities(currentCondition);

    } catch (error) {
        console.error('Error updating UI:', error);
        alert('Error displaying weather data. Please try again.');
    }
}

// Add event listener for Enter key in search input
document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const location = this.value;
        if (location) {
            fetchWeatherData(location);
        }
    }
});

// Add this function after updateUI
function updateConditionColors(rainChance, snowChance, cloudCover, isDay) {
    try {
        // Rain icon color
        const rainIcon = document.querySelector('.condition-item:nth-child(1) i');
        if (rainIcon) {
            rainIcon.style.color = rainChance > 50 ? '#0066ff' : '#1e3c72';
        }

        // Snow icon color
        const snowIcon = document.querySelector('.condition-item:nth-child(2) i');
        if (snowIcon) {
            snowIcon.style.color = snowChance > 50 ? '#00ccff' : '#1e3c72';
        }

        // Cloud icon color
        const cloudIcon = document.querySelector('.condition-item:nth-child(3) i');
        if (cloudIcon) {
            cloudIcon.style.color = cloudCover > 50 ? '#666666' : '#1e3c72';
        }

        // Clear Weather icon color
        const clearIcon = document.querySelector('.condition-item:nth-child(4) i');
        if (clearIcon) {
            clearIcon.style.color = isDay ? '#f39c12' : '#1e3c72'; // Yellow for day, blue for night
        }
    } catch (error) {
        console.error('Error updating condition colors:', error);
        // Don't show alert for color updates as it's not critical
    }
}

// Add this function to handle activity recommendations
function updateActivities(weatherCondition) {
    const activitiesContainer = document.getElementById('activities-container');
    const equipmentContainer = document.getElementById('equipment-container');
    let activities = [];
    let icons = [];
    let equipment = [];

    // Define activities and equipment per weather condition
    switch(weatherCondition.toLowerCase()) {
        case 'sunny':
        case 'clear':
            activities = ['Swimming', 'Hiking'];
            icons = ['fa-swimmer', 'fa-hiking'];
            equipment = [
                {
                    activity: 'Swimming',
                    items: ['Swimsuit', 'Goggles', 'Towel']
                },
                {
                    activity: 'Hiking',
                    items: ['Weather-appropriate clothing', 'Backpack', 'Hiking Boots']
                }
            ];
            break;
        case 'cloudy':
        case 'partly cloudy':
            activities = ['Cycling', 'Outdoor Yoga'];
            icons = ['fa-bicycle', 'fa-pray'];
            equipment = [
                {
                    activity: 'Cycling',
                    items: ['Bike', 'Helmet', 'Bike Shoes']
                },
                {
                    activity: 'Outdoor Yoga',
                    items: ['Yoga Mat', 'Yoga Towel', 'Earbuds']
                }
            ];
            break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
        case 'heavy rain':
            activities = ['Kayaking', 'Waterfall Hiking'];
            icons = ['fa-water', 'fa-mountain'];
            equipment = [
                {
                    activity: 'Kayaking',
                    items: ['Kayak', 'Paddle', 'Dry Bag']
                },
                {
                    activity: 'Waterfall Hiking',
                    items: ['Waterproof Hiking Shoes', 'Lightweight Rain Jacket', 'Water Bottle']
                }
            ];
            break;
        case 'snow':
        case 'light snow':
        case 'moderate snow':
        case 'heavy snow':
            activities = ['Skiing/Snowboarding', 'Snow Sculpting/Building'];
            icons = ['fa-skiing', 'fa-snowman'];
            equipment = [
                {
                    activity: 'Skiing/Snowboarding',
                    items: ['Snowboard', 'Goggles', 'Gloves']
                },
                {
                    activity: 'Snow Sculpting/Building',
                    items: ['Shovels', 'Snow Carving Tools', 'Hand Warmers']
                }
            ];
            break;
        default:
            activities = ['Check weather conditions', 'Plan accordingly'];
            icons = ['fa-cloud-sun', 'fa-calendar'];
            equipment = [];
    }

    // Create HTML for activities
    const activitiesHTML = activities.map((activity, index) => `
        <div class="activity-item">
            <i class="fas ${icons[index]}"></i>
            <p>${activity}</p>
        </div>
    `).join('');

    // Create HTML for equipment
    const equipmentHTML = equipment.map(item => `
        <div class="equipment-category">
            <h3>${item.activity} Equipment:</h3>
            <ul>
                ${item.items.map(equipment => `<li>${equipment}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    activitiesContainer.innerHTML = activitiesHTML;
    equipmentContainer.innerHTML = equipmentHTML;
}

// Helper function to get AQI description
function getAQIDescription(aqi) {
    const descriptions = {
        1: "Good",
        2: "Moderate",
        3: "Unhealthy for Sensitive Groups",
        4: "Unhealthy",
        5: "Very Unhealthy",
        6: "Hazardous"
    };
    return descriptions[aqi] || "No Data Available";
}

function saveWeatherReport(data) {
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Create CRUDFiles directory if it doesn't exist
        const crudPath = path.join(__dirname, 'CRUDFiles');
        if (!fs.existsSync(crudPath)) {
            fs.mkdirSync(crudPath);
        }

        // Get the displayed activities and equipment text directly from the UI
        const activitiesSection = document.querySelector('.activities-box').innerText;
        const equipmentSection = document.querySelector('.equipment-box').innerText;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `weather_${data.location.name}_${timestamp}.txt`;
        const filePath = path.join(crudPath, filename);

        // Create the report content including activities and equipment
        const reportContent = `Weather Report for ${data.location.name}
=================================
Location: ${data.location.name}, ${data.location.region}, ${data.location.country}
Local Time: ${data.location.localtime}

Current Weather
--------------
Temperature: ${Math.round(data.current.temp_c)}°C
Condition: ${data.current.condition.text}
Feels Like: ${Math.round(data.current.feelslike_c)}°C
Wind Speed: ${Math.round(data.current.wind_kph)} km/h
Humidity: ${data.current.humidity}%

Forecast
--------
Today: ${Math.round(data.forecast.forecastday[0].day.avgtemp_c)}°C
Tomorrow: ${Math.round(data.forecast.forecastday[1].day.avgtemp_c)}°C

Sun Times
---------
Sunrise: ${data.forecast.forecastday[0].astro.sunrise}
Sunset: ${data.forecast.forecastday[0].astro.sunset}

Weather Conditions
----------------
Rain Chance: ${data.forecast.forecastday[0].day.daily_chance_of_rain}%
Snow Chance: ${data.forecast.forecastday[0].day.daily_chance_of_snow}%
Cloud Cover: ${data.current.cloud}%

Air Quality
----------
Index: ${data.current.air_quality["us-epa-index"]}
Status: ${getAQIDescription(data.current.air_quality["us-epa-index"])}

${activitiesSection}

${equipmentSection}

Report generated on: ${new Date().toLocaleString()}`;

        fs.writeFileSync(filePath, reportContent);
        alert(`Weather report saved as ${filename}`);

    } catch (error) {
        console.error('Error saving weather report:', error);
        alert('Error saving weather report. Please try again.');
    }
}