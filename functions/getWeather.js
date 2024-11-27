import fetch from 'node-fetch';

export async function getWeather(location) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return `Været i ${location}: ${data.weather[0].description}, temperatur: ${data.main.temp}°C.`;
        } else {
            return `Kunne ikke hente værdata for ${location}: ${data.message}`;
        }
    } catch (error) {
        console.error('Feil ved henting av værdata:', error);
        return 'Kunne ikke hente værdata på grunn av en intern feil.';
    }
}
