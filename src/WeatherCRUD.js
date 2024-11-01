const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

class WeatherCRUD {
    constructor() {
        this.pathName = path.join(__dirname, 'CRUDFiles');
        this.initializeDirectory();
        this.initializeSaveButton();
        console.log('WeatherCRUD initialized. Path:', this.pathName);
    }

    initializeDirectory() {
        try {
            if (!fs.existsSync(this.pathName)) {
                fs.mkdirSync(this.pathName, { recursive: true });
                console.log('Directory created:', this.pathName);
            }
        } catch (error) {
            console.error('Error creating directory:', error);
            alert('Error creating directory: ' + error.message);
        }
    }

    initializeSaveButton() {
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                console.log('Save button clicked');
                this.saveWeatherData();
            });
        } else {
            console.error('Save button not found');
        }
    }

    saveWeatherData() {
        try {
            if (!window.currentWeatherData) {
                alert('No weather data to save. Please search for a location first.');
                return;
            }

            const data = window.currentWeatherData;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `weather_${data.location.name}_${timestamp}.txt`;
            const filePath = path.join(this.pathName, filename);

            // Get the displayed activities and equipment text directly from the UI
            const activitiesSection = document.querySelector('#activities-container').innerText;
            const equipmentSection = document.querySelector('#equipment-container').innerText;

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
Status: ${this.getAQIDescription(data.current.air_quality["us-epa-index"])}

Recommended Outdoor Activities
--------------------------
${activitiesSection}

Recommended Equipment
----------------
${equipmentSection}

Report generated on: ${new Date().toLocaleString()}`;

            fs.writeFileSync(filePath, reportContent);
            alert(`Weather report saved as ${filename}`);
            console.log('File saved successfully');

            // Notify the main process that a file was saved
            ipcRenderer.send('weather-data-saved');

        } catch (error) {
            console.error('Error saving weather data:', error);
            alert('Error saving weather data: ' + error.message);
        }
    }

    getAQIDescription(aqi) {
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
}

// Initialize the CRUD system
try {
    const weatherCRUD = new WeatherCRUD();
    console.log('WeatherCRUD system initialized successfully');
} catch (error) {
    console.error('Error initializing WeatherCRUD:', error);
}
