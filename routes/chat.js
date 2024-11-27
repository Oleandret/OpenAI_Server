import { getWeather } from '../functions/getWeather.js';

if (functionCall) {
    const { name, arguments: args } = functionCall;

    if (name === 'getWeather') {
        const location = JSON.parse(args).location;
        console.log('Henter vær for lokasjon:', location);

        // Kall værfunksjonen
        const weatherInfo = await getWeather(location);

        // Returner værdata som respons
        return res.json({
            response: weatherInfo,
        });
    }
}
