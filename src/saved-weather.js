const fs = require('fs');
const path = require('path');

class SavedWeatherHandler {
    constructor() {
        this.pathName = path.join(__dirname, 'CRUDFiles');
        this.loadSavedWeatherData();
    }

    loadSavedWeatherData() {
        const container = document.getElementById('savedWeatherContainer');
        container.innerHTML = ''; // Clear existing content

        try {
            const files = fs.readdirSync(this.pathName);
            
            if (files.length === 0) {
                container.innerHTML = '<p>No saved weather data found.</p>';
                return;
            }

            files.forEach(file => {
                if (file.endsWith('.txt')) {
                    const content = fs.readFileSync(path.join(this.pathName, file), 'utf-8');
                    this.createWeatherCard(file, content);
                }
            });
        } catch (error) {
            console.error('Error loading saved weather data:', error);
            container.innerHTML = '<p>Error loading saved weather data.</p>';
        }
    }

    createWeatherCard(filename, content) {
        const container = document.getElementById('savedWeatherContainer');
        const card = document.createElement('div');
        card.className = 'weather-data';
        
        // Parse the content sections
        const sections = this.parseWeatherContent(content);
        
        card.innerHTML = `
            <div class="report-info">
                <h2>${sections.location}</h2>
                <p>${sections.localTime}</p>
            </div>
            
            <div class="weather-grid">
                <div class="weather-box">
                    <h3>Current Weather</h3>
                    <div class="weather-content">
                        ${sections.currentWeather}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Forecast</h3>
                    <div class="weather-content">
                        ${sections.forecast}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Sun Times</h3>
                    <div class="weather-content">
                        ${sections.sunTimes}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Weather Conditions</h3>
                    <div class="weather-content">
                        ${sections.weatherConditions}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Air Quality</h3>
                    <div class="weather-content">
                        ${sections.airQuality}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Recommended Activities</h3>
                    <div class="weather-content">
                        ${sections.activities}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Recommended Equipment</h3>
                    <div class="weather-content">
                        ${sections.equipment}
                    </div>
                </div>

                <div class="weather-box">
                    <h3>Comment</h3>
                    <div class="weather-content">
                        <textarea id="comment-${filename}" class="comment-box" placeholder="Enter your comment here...">${sections.comment || ''}</textarea>
                    </div>
                </div>
            </div>

            <div class="report-footer">
                ${sections.reportGenerated}
            </div>

            <div class="action-buttons">
                <button class="action-button update-btn" onclick="savedWeatherHandler.updateWeatherData('${filename}')">
                    Update
                </button>
                <button class="action-button delete-btn" onclick="savedWeatherHandler.deleteWeatherData('${filename}')">
                    Delete
                </button>
            </div>
        `;
        
        container.appendChild(card);
    }

    parseWeatherContent(content) {
        const sections = {
            location: '',
            localTime: '',
            currentWeather: '',
            forecast: '',
            sunTimes: '',
            weatherConditions: '',
            airQuality: '',
            activities: '',
            equipment: '',
            comment: '',
            reportGenerated: ''
        };

        const lines = content.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            if (line.includes('Weather Report for')) {
                sections.location = line;
            } else if (line.includes('Local Time:')) {
                sections.localTime = line;
            } else if (line.includes('Current Weather')) {
                currentSection = 'currentWeather';
            } else if (line.includes('Forecast')) {
                currentSection = 'forecast';
            } else if (line.includes('Sun Times')) {
                currentSection = 'sunTimes';
            } else if (line.includes('Weather Conditions')) {
                currentSection = 'weatherConditions';
            } else if (line.includes('Air Quality')) {
                currentSection = 'airQuality';
            } else if (line.includes('Recommended Outdoor Activities')) {
                currentSection = 'activities';
            } else if (line.includes('Recommended Equipment')) {
                currentSection = 'equipment';
            } else if (line.includes('Comment:')) {
                currentSection = 'comment';
            } else if (line.includes('Report generated')) {
                sections.reportGenerated = line;
            } else if (line.trim() !== '') {
                if (currentSection) {
                    sections[currentSection] += line + '\n';
                }
            }
        });

        return sections;
    }

    updateWeatherData(filename) {
        try {
            const filePath = path.join(this.pathName, filename);
            const content = fs.readFileSync(filePath, 'utf-8');
            const commentElement = document.getElementById(`comment-${filename}`);
            const comment = commentElement ? commentElement.value : '';

            // Split content into sections
            const sections = content.split('Comment:');
            let newContent = sections[0].trim();

            // Add comment section
            newContent += '\n\nComment:\n' + comment;

            // Add report generation time
            const reportGenTime = new Date().toLocaleString();
            newContent += `\n\nReport generated on: ${reportGenTime}`;

            fs.writeFileSync(filePath, newContent);
            alert('Weather data updated successfully!');
            this.loadSavedWeatherData(); // Refresh display
        } catch (error) {
            console.error('Error updating weather data:', error);
            alert('Error updating weather data: ' + error.message);
        }
    }

    deleteWeatherData(filename) {
        try {
            const filePath = path.join(this.pathName, filename);
            fs.unlinkSync(filePath);
            this.loadSavedWeatherData(); // Refresh the display
            alert(`${filename} has been deleted successfully.`);
        } catch (error) {
            console.error('Error deleting weather data:', error);
            alert('Error deleting weather data.');
        }
    }
}

const savedWeatherHandler = new SavedWeatherHandler(); 