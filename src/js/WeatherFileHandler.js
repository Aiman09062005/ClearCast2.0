const fs = require('fs');
const path = require('path');

class WeatherFileHandler {
    constructor() {
        this.pathName = path.join(__dirname, '..', 'WeatherFiles');
        this.initializeDirectory();
        this.initializeButtons();
    }

    initializeDirectory() {
        if (!fs.existsSync(this.pathName)) {
            fs.mkdirSync(this.pathName);
        }
    }

    initializeButtons() {
        const btnCreate = document.getElementById('btnCreate');
        const btnRead = document.getElementById('btnRead');
        const btnDelete = document.getElementById('btnDelete');
        const fileName = document.getElementById('fileName');

        btnCreate.addEventListener('click', () => this.saveWeatherData(fileName.value));
        btnRead.addEventListener('click', () => this.loadWeatherData(fileName.value));
        btnDelete.addEventListener('click', () => this.deleteWeatherData(fileName.value));
    }

    saveWeatherData(filename) {
        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        const weatherData = window.currentWeatherData;
        if (!weatherData) {
            alert('No weather data to save. Please search for a location first.');
            return;
        }

        const filePath = path.join(this.pathName, `${filename}.json`);
        fs.writeFile(filePath, JSON.stringify(weatherData, null, 2), (err) => {
            if (err) {
                alert("Error saving weather data: " + err.message);
                return;
            }
            alert(`Weather data saved as ${filename}.json`);
        });
    }

    loadWeatherData(filename) {
        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        const filePath = path.join(this.pathName, `${filename}.json`);
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                alert("Error loading weather data: " + err.message);
                return;
            }
            try {
                const weatherData = JSON.parse(data);
                window.currentWeatherData = weatherData;
                updateUI(weatherData);
                alert(`Weather data loaded from ${filename}.json`);
            } catch (error) {
                alert("Error parsing weather data: " + error.message);
            }
        });
    }

    deleteWeatherData(filename) {
        if (!filename) {
            alert('Please enter a filename');
            return;
        }

        const filePath = path.join(this.pathName, `${filename}.json`);
        fs.unlink(filePath, (err) => {
            if (err) {
                alert("Error deleting weather data: " + err.message);
                return;
            }
            document.getElementById('fileName').value = '';
            alert(`${filename}.json deleted successfully`);
        });
    }
}

// Initialize the weather file handler
const weatherFileHandler = new WeatherFileHandler(); 