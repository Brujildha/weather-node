const axios = require('axios');
const fs = require('fs');

class Search {
    history = [];
    dataPath = './db/history.json';
    constructor() {
        this.readData();
    }
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeather() {
        return {
            'appid': process.env.OPEN_WEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    get historyCapitalization() {
        return this.history.map(item => {
            let words = item.split(' ');
            words = words.map(word => word[0].toUpperCase() + word.substring(1));
            return words.join(' ');
        });
    }
    async cities(place = '') {
        try {
            const instance = await axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox

            });
            const response = await instance.get();

            return response.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                longitude: place.center[0],
                latitude: place.center[1]
            }));
        } catch (error) {
            return error.message;
        }

    }
    async weather(lat, lon) {
        try {
            const instance = await axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsWeather, lat, lon }
            });
            const response = await instance.get();
            const { weather, main } = response.data;

            return {
                description: weather[0].description,
                temperature: main.temp,
                minTemperature: main.temp_min,
                maxTemperature: main.temp_max
            };
        } catch (error) {
            return error.message;
        }
    }
    addHistory(place = '') {
        if (!this.history.includes(place.toLocaleLowerCase())) {
            this.history = this.history.splice(0, 5);
            this.history.unshift(place.toLocaleLowerCase());
        }
        this.saveData();
    }
    saveData() {
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dataPath, JSON.stringify(payload));
    }
    readData() {
        try {
            if (!fs.existsSync(this.dataPath)) {
                return null;
            }
            const data = fs.readFileSync(this.dataPath, { encoding: 'utf-8' });
            const payload = JSON.parse(data);
            this.history = payload.history;
        } catch (error) {
            this.history = [];
        }
    }
}

module.exports = Search;