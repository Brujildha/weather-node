require('dotenv').config()
const { inquirerMenu, pause, readInput, getPlaces } = require("./helpers/inquirer");
const Search = require("./models/search");


const main = async () => {
    let opt = '';
    const search = new Search();
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const place = await readInput('Place:');
                const places = await search.cities(place);

                const idselected = await getPlaces(places);
                if (idselected != 0) {
                    const placeSelected = places.find(p => p.id === idselected);
                    search.addHistory(placeSelected.name);
                    const weather = await search.weather(placeSelected.latitude, placeSelected.longitude);

                    console.clear();
                    console.log('Información de la ciudad');
                    console.log('Ciudad:', placeSelected.name);
                    console.log('Latitud:', placeSelected.latitude);
                    console.log('Longitud:', placeSelected.longitude);
                    console.log('Clima:', weather.description);
                    console.log('Temperatura:', weather.temperature);
                    console.log('Mínima temperatura:', weather.minTemperature);
                    console.log('Máxima temperatura:', weather.maxTemperature);
                }
                break;
            case 2:
                search.historyCapitalization.forEach((place, i) => {
                    const idx = i + 1;
                    console.log(`${idx}. ${place}`);
                })
                break;
        }

        await pause();

    } while (opt !== 0)
}

main();